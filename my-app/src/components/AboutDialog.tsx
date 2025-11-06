import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function AboutDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        size="small"
        color="primary"
        onClick={() => setOpen(true)}
        aria-label="About this app"
        sx={{
          padding: "6px",
          color: "#b83f45",
          "&:hover": {
            backgroundColor: "rgba(184,63,69,0.06)",
          },
        }}
      >
        <InfoOutlinedIcon fontSize="small" />
      </IconButton>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            paddingX: 0.5,
            paddingY: 0.5,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 300,
            fontSize: 20,
            color: "#b83f45",
          }}
        >
          Todo App
        </DialogTitle>
        <DialogContent
          sx={{
            fontSize: 14,
          }}
        >
          <Typography variant="body2" sx={{ mb: 1 }}>
            This todo application is built with React, TypeScript, Redux Saga,
            and a REST API backend.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Material UI is used here to demonstrate modern UI components
            integration in a minimal and clean way.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 1.5 }}>
          <Button
            onClick={() => setOpen(false)}
            variant="text"
            sx={{
              textTransform: "none",
              fontSize: 14,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
