import { useEffect, useMemo, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useToast } from "../hooks/useToast";
import { useTodos } from "../hooks/useTodo";
import { ToastContainer } from "../components/Toast";

const PAGE_SIZE = 100;

export default function ThreeDReport() {
  const toast = useToast();
  const { todos, counts, error } = useTodos({
    toast,
    filter: "all",
    page: 1,
    pageSize: PAGE_SIZE,
  });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    function startViewer() {
      const Autodesk = (window as any).Autodesk;
      if (!Autodesk || !Autodesk.Viewing || viewerRef.current) {
        return;
      }

      const options: any = {
        env: "AutodeskProduction",
        getAccessToken: (
          onSuccess: (token: string, expire: number) => void,
        ) => {
          const token = import.meta.env.VITE_APS_ACCESS_TOKEN as
            | string
            | undefined;
          const expiresIn = 1800;
          if (token) {
            onSuccess(token, expiresIn);
          }
        },
      };

      Autodesk.Viewing.Initializer(options, () => {
        if (!containerRef.current) {
          return;
        }

        const viewer = new Autodesk.Viewing.GuiViewer3D(containerRef.current);
        const startedCode = viewer.start();
        if (startedCode !== 0) {
          return;
        }

        viewerRef.current = viewer;

        const urn = import.meta.env.VITE_APS_MODEL_URN as string | undefined;
        if (!urn) {
          return;
        }

        const documentId = "urn:" + urn;

        Autodesk.Viewing.Document.load(
          documentId,
          (doc: any) => {
            const defaultModel = doc.getRoot().getDefaultGeometry();
            if (defaultModel) {
              viewer.loadDocumentNode(doc, defaultModel);
            }
          },
          () => {},
        );
      });
    }

    if (!(window as any).Autodesk || !(window as any).Autodesk.Viewing) {
      const scriptId = "aps-viewer-script";
      const existingScript = document.getElementById(
        scriptId,
      ) as HTMLScriptElement | null;

      if (!existingScript) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src =
          "https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.js";
        script.async = true;
        script.onload = () => {
          startViewer();
        };
        document.body.appendChild(script);
      } else {
        existingScript.onload = () => {
          startViewer();
        };
      }
    } else {
      startViewer();
    }

    return () => {
      const viewer = viewerRef.current;
      if (viewer) {
        try {
          viewer.finish();
          viewer.tearDown();
          viewer.uninitialize();
        } catch (e) {}
        viewerRef.current = null;
      }
    };
  }, []);

  const markers = useMemo(() => {
    const maxMarkers = 72;
    const visibleTodos = todos.slice(0, maxMarkers);
    const maxPerRow = 12;
    const horizontalGap = 52;
    const verticalGap = 26;
    const startX = 32;
    const startY = 40;

    return visibleTodos.map((todo, index) => {
      const row = Math.floor(index / maxPerRow);
      const col = index % maxPerRow;
      const left = startX + col * horizontalGap;
      const top = startY + row * verticalGap;
      const isCompleted = todo.completed;
      const backgroundColor = isCompleted ? "#b83f45" : "#f97316";
      const borderRadius = isCompleted ? "999px" : "3px";
      const title = todo.text + (isCompleted ? " • Completed" : " • Active");

      return (
        <div
          key={todo.id}
          style={{
            position: "absolute",
            left: left + "px",
            top: top + "px",
            width: "10px",
            height: "10px",
            borderRadius: borderRadius,
            backgroundColor: backgroundColor,
            boxShadow: "0px 2px 6px rgba(0,0,0,0.18)",
            pointerEvents: "auto",
            cursor: "pointer",
          }}
          title={title}
        />
      );
    });
  }, [todos]);

  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />
      <main>
        <div
          style={{
            width: "900px",
            maxWidth: "90%",
            margin: "32px auto 0px auto",
          }}
        >
          <h2
            style={{
              fontSize: "28px",
              fontWeight: 200,
              color: "#b83f45",
              textAlign: "left",
              margin: "0px 0px 4px 0px",
            }}
          >
            3D Task Space
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "#7b7b7b",
              margin: "0px 0px 16px 0px",
            }}
          >
            Visual overview of your tasks mapped into a 3D-powered scene using
            Autodesk Platform Services.
          </p>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "420px",
              borderRadius: "14px",
              overflow: "hidden",
              backgroundColor: "#f6f6f6",
              boxShadow: "0px 8px 28px rgba(0,0,0,0.10)",
              border: "1px solid #e5e5e5",
            }}
          >
            <div
              ref={containerRef}
              style={{
                position: "absolute",
                left: "0px",
                top: "0px",
                right: "0px",
                bottom: "0px",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: "0px",
                top: "0px",
                right: "0px",
                bottom: "0px",
                pointerEvents: "none",
              }}
            >
              {markers}
            </div>
          </div>
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "11px",
              color: "#9b9b9b",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "3px",
                backgroundColor: "#f97316",
                boxShadow: "0px 1px 3px rgba(0,0,0,0.16)",
              }}
            />
            <span>Active tasks</span>
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "999px",
                backgroundColor: "#b83f45",
                boxShadow: "0px 1px 3px rgba(0,0,0,0.16)",
              }}
            />
            <span>Completed tasks</span>
            <span style={{ marginLeft: "8px" }}>
              Total: {counts.total} • Active: {counts.active} • Completed:{" "}
              {counts.completed}
            </span>
          </div>
          {error && (
            <div
              style={{
                marginTop: "12px",
                fontSize: "12px",
                color: "#b83f45",
              }}
            >
              {error}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <ToastContainer messages={toast.messages} />
    </div>
  );
}
