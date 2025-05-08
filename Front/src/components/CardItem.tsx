// src/components/CardItem.tsx
import React, { useState } from "react";
import {
  Paper,
  Typography,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { Draggable } from "react-beautiful-dnd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Card } from "../types/kanban";

interface Props {
  card: Card;
  index: number;
  onEdit: (updatedCard: Card) => void;
  onDelete: (cardId: string) => void;
}

const CardItem: React.FC<Props> = ({ card, index, onEdit, onDelete }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedCard, setEditedCard] = useState(card);

  const handleOpenEditDialog = () => {
    setEditedCard(card);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  const handleSave = () => {
    onEdit(editedCard);
    handleCloseEditDialog();
  };

  const handleDelete = () => {
    onDelete(card.id);
  };

  return (
    <>
      <Draggable draggableId={card.id} index={index}>
        {(provided, snapshot) => (
          <Paper
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            elevation={0}
            sx={{
              padding: "12px 16px",
              marginBottom: "12px",
              backgroundColor: snapshot.isDragging
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(255, 255, 255, 0.03)",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              boxShadow: snapshot.isDragging
                ? "0 8px 16px rgba(0, 0, 0, 0.3)"
                : "0 2px 4px rgba(0, 0, 0, 0.1)",
              cursor: "grab",
              transition: "all 0.2s ease",
              transform: snapshot.isDragging ? "rotate(2deg)" : "none",
              position: "relative",
              zIndex: snapshot.isDragging ? 9999 : 1,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.07)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
              },
              "&:active": {
                cursor: "grabbing",
              },
            }}
          >
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 500,
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: "14px",
                  mb: 1,
                  wordBreak: "break-word",
                  lineHeight: 1.4,
                }}
              >
                {card.title}
              </Typography>
              {card.description && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "12px",
                    mb: 1,
                    wordBreak: "break-word",
                    lineHeight: 1.5,
                  }}
                >
                  {card.description}
                </Typography>
              )}
              <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                sx={{ mt: 1 }}
              >
                <IconButton
                  onClick={handleOpenEditDialog}
                  size="small"
                  sx={{
                    color: "rgba(255, 255, 255, 0.5)",
                    padding: "4px",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      color: "#3182ce",
                    },
                  }}
                >
                  <EditIcon sx={{ fontSize: 18 }} />
                </IconButton>
                <IconButton
                  onClick={handleDelete}
                  size="small"
                  sx={{
                    color: "rgba(255, 255, 255, 0.5)",
                    padding: "4px",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      color: "#ef4444",
                    },
                  }}
                >
                  <DeleteIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        )}
      </Draggable>

      <Dialog
        open={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        PaperProps={{
          sx: {
            background: "#1a202c",
            borderRadius: "12px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            maxWidth: { xs: "90%", sm: "500px" },
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "rgba(255, 255, 255, 0.05)",
            color: "white",
            fontWeight: 500,
            fontSize: "18px",
            padding: "20px 24px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          Editar Tarjeta
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2, backgroundColor: "#1a202c" }}>
          <TextField
            autoFocus
            margin="dense"
            label="Título de la tarjeta"
            fullWidth
            value={editedCard.title}
            onChange={(e) =>
              setEditedCard({ ...editedCard, title: e.target.value })
            }
            variant="outlined"
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.2)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.3)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#3182ce",
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255, 255, 255, 0.7)",
                "&.Mui-focused": {
                  color: "#3182ce",
                },
              },
            }}
          />
          <TextField
            margin="dense"
            label="Descripción"
            fullWidth
            multiline
            rows={4}
            value={editedCard.description}
            onChange={(e) =>
              setEditedCard({ ...editedCard, description: e.target.value })
            }
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.2)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.3)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#3182ce",
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255, 255, 255, 0.7)",
                "&.Mui-focused": {
                  color: "#3182ce",
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0, backgroundColor: "#1a202c" }}>
          <Button
            onClick={handleCloseEditDialog}
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                background: "rgba(255, 255, 255, 0.05)",
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              background: "#3182ce",
              color: "white",
              textTransform: "none",
              fontWeight: 500,
              px: 3,
              "&:hover": {
                background: "#2c5282",
              },
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CardItem;
