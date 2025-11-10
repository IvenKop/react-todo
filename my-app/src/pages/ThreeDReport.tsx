import { useEffect, useRef, useState, useMemo } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useToast } from "../hooks/useToast";
import { useTodos } from "../hooks/useTodo";
import { ToastContainer } from "../components/Toast";
import { useTranslation } from "react-i18next";

const PAGE_SIZE = 100;

type HoveredTask = {
  id: string;
  text: string;
  left: number;
  top: number;
  completed: boolean;
};

export default function ThreeDReport() {
  const toast = useToast();
  const { todos, counts, error } = useTodos({
    toast,
    filter: "all",
    page: 1,
    pageSize: PAGE_SIZE,
  });
  const { t } = useTranslation();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<any>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState<HoveredTask | null>(null);

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
    const horizontalGap = 58;
    const verticalGap = 40;
    const startX = 40;
    const startY = 60;

    return visibleTodos.map((todo, index) => {
      const row = Math.floor(index / maxPerRow);
      const col = index % maxPerRow;
      const left = startX + col * horizontalGap;
      const top = startY + row * verticalGap;
      const isCompleted = todo.completed;

      const baseShadow = "0px 6px 14px rgba(0,0,0,0.20)";
      const activeStyle = {
        width: 18,
        height: 18,
        borderRadius: 4,
        background:
          "linear-gradient(145deg, #fbbf77 0%, #f97316 40%, #d85f0d 100%)",
        boxShadow: baseShadow,
      };
      const completedStyle = {
        width: 18,
        height: 18,
        borderRadius: 999,
        background:
          "linear-gradient(145deg, #f8b1ad 0%, #b83f45 40%, #8f262b 100%)",
        boxShadow: baseShadow,
      };

      const style = isCompleted ? completedStyle : activeStyle;

      return {
        id: todo.id,
        text: todo.text,
        completed: isCompleted,
        left,
        top,
        style,
      };
    });
  }, [todos]);

  const tooltip = useMemo(() => {
    if (!hovered || !overlayRef.current) {
      return null;
    }

    const containerRect = overlayRef.current.getBoundingClientRect();
    const tooltipWidth = 260;
    const tooltipHeight = 64;

    let left = hovered.left + 16;
    let top = hovered.top - tooltipHeight - 8;

    if (left + tooltipWidth > containerRect.width - 12) {
      left = containerRect.width - tooltipWidth - 12;
    }
    if (left < 8) {
      left = 8;
    }
    if (top < 8) {
      top = hovered.top + 20;
    }

    const label =
      hovered.text.length > 90
        ? hovered.text.slice(0, 87) + "..."
        : hovered.text;

    return (
      <div
        style={{
          position: "absolute",
          left: left + "px",
          top: top + "px",
          width: tooltipWidth + "px",
          minHeight: tooltipHeight + "px",
          padding: "8px 10px",
          borderRadius: "10px",
          backgroundColor: "rgba(255,255,255,0.96)",
          boxShadow: "0px 10px 26px rgba(0,0,0,0.18)",
          border: "1px solid #e5e5e5",
          pointerEvents: "none",
          zIndex: 40,
        }}
      >
        <div
          style={{
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "1.1px",
            color: "#9b9b9b",
            marginBottom: "2px",
          }}
        >
          {hovered.completed
            ? t("threeD.tooltip.completed")
            : t("threeD.tooltip.active")}
        </div>
        <div
          style={{
            fontSize: "13px",
            color: "#333333",
            lineHeight: "18px",
            fontWeight: 300,
          }}
        >
          {label}
        </div>
      </div>
    );
  }, [hovered, t]);

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
            {t("threeD.title")}
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "#7b7b7b",
              margin: "0px 0px 16px 0px",
            }}
          >
            {t("threeD.description")}
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
              ref={overlayRef}
              style={{
                position: "absolute",
                left: "0px",
                top: "0px",
                right: "0px",
                bottom: "0px",
                pointerEvents: "none",
              }}
            >
              {markers.map((m) => (
                <div
                  key={m.id}
                  style={{
                    position: "absolute",
                    left: m.left + "px",
                    top: m.top + "px",
                    width: m.style.width + "px",
                    height: m.style.height + "px",
                    borderRadius: m.style.borderRadius,
                    background: m.style.background,
                    boxShadow: m.style.boxShadow,
                    pointerEvents: "auto",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: "translateZ(0)",
                  }}
                  onMouseEnter={() =>
                    setHovered({
                      id: m.id,
                      text: m.text,
                      left: m.left,
                      top: m.top,
                      completed: m.completed,
                    })
                  }
                  onMouseLeave={() =>
                    setHovered((prev) =>
                      prev && prev.id === m.id ? null : prev,
                    )
                  }
                />
              ))}
              {tooltip}
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
                width: "14px",
                height: "14px",
                borderRadius: "4px",
                background:
                  "linear-gradient(145deg, #fbbf77 0%, #f97316 40%, #d85f0d 100%)",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.18)",
              }}
            />
            <span>{t("threeD.legend.active")}</span>
            <div
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "999px",
                background:
                  "linear-gradient(145deg, #f8b1ad 0%, #b83f45 40%, #8f262b 100%)",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.18)",
              }}
            />
            <span>{t("threeD.legend.completed")}</span>
            <span style={{ marginLeft: "8px" }}>
              {t("threeD.counts", {
                total: counts.total,
                active: counts.active,
                completed: counts.completed,
              })}
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
