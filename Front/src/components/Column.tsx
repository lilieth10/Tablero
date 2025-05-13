// src/components/Column.tsx
import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { DroppableProvided } from "react-beautiful-dnd";
import CardItem from "./CardItem";
import { Card, Column as ColumnType } from "../types/kanban";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

type Props = {
  column: ColumnType;
  cards: Card[];
  provided: DroppableProvided;
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  setColumns: React.Dispatch<React.SetStateAction<ColumnType[]>>;
  deleteCard: (cardId: string) => Promise<void>;
  deleteColumn: (columnId: string) => void;
  lastAction: React.MutableRefObject<null | 'move' | 'update' | 'add' | 'addColumn'>;
};

const Column = ({
  column,
  cards,
  provided,
  setCards,
  deleteCard,
  deleteColumn,
  lastAction,
}: Props) => {
  const [isNewCardDialogOpen, setIsNewCardDialogOpen] = useState(false);
  const [newCard, setNewCard] = useState({
    title: "",
    description: "",
  });

  const handleOpenNewCardDialog = () => {
    setIsNewCardDialogOpen(true);
  };

  const handleCloseNewCardDialog = () => {
    setIsNewCardDialogOpen(false);
    setNewCard({ title: "", description: "" });
  };

  const handleAddCard = async () => {
    if (!newCard.title.trim()) {
      toast.warning("Por favor, ingresa un título para la tarjeta");
      return;
    }
    try {
      if (lastAction) lastAction.current = 'add';
      const cardToAdd = {
        title: newCard.title.trim(),
        description: newCard.description.trim(),
        columnId: column.id,
        position: cards.filter((card) => card.columnId === column.id).length,
      };
      await axios.post(`${API_URL}/cards`, cardToAdd);
      toast.success("Tarjeta agregada exitosamente");
      handleCloseNewCardDialog();
    } catch (error) {
      console.error("Error adding card:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          `Error al agregar la tarjeta: ${error.response.data.message || "Error del servidor"}`,
        );
      } else {
        toast.error(
          "Error al agregar la tarjeta. Por favor, intenta nuevamente.",
        );
      }
    }
  };

  const handleEditCard = async (updatedCard: Card) => {
    try {
      if (lastAction) lastAction.current = 'update';
      const cardToUpdate = {
        title: updatedCard.title,
        description: updatedCard.description,
        columnId: updatedCard.columnId,
        position: updatedCard.position || 0,
      };
      const response = await axios.patch(
        `${API_URL}/cards/${updatedCard.id}`,
        cardToUpdate,
      );
      if (response.data) {
        const updatedCardWithDragProps = {
          ...response.data,
          id: updatedCard.id,
          columnId: updatedCard.columnId,
          position: updatedCard.position,
        };
        setCards((prev) =>
          prev.map((card) =>
            card.id === updatedCard.id ? updatedCardWithDragProps : card,
          ),
        );
        toast.success("Tarjeta actualizada exitosamente");
      }
    } catch (error) {
      console.error("Error updating card:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          `Error al actualizar la tarjeta: ${error.response.data.message || "Error del servidor"}`,
        );
      } else {
        toast.error(
          "Error al actualizar la tarjeta. Por favor, intenta nuevamente.",
        );
      }
    }
  };

  const handleDeleteColumn = async () => {
    try {
      await deleteColumn(column.id);
      toast.success("Columna eliminada exitosamente");
    } catch (error) {
      toast.error("Error al eliminar la columna");
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      await deleteCard(cardId);
      toast.success("Tarjeta eliminada exitosamente");
    } catch (error) {
      toast.error("Error al eliminar la tarjeta");
    }
  };

  const columnCards = cards
    .filter((card) => card.columnId === column.id)
    .sort((a, b) => (a.position || 0) - (b.position || 0));

  return (
    <>
      <Paper
        ref={provided.innerRef}
        {...provided.droppableProps}
        elevation={0}
        sx={{
          padding: "16px",
          width: { xs: "300px", sm: "320px" },
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          borderRadius: "12px",
          minHeight: "100px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          transition: "all 0.2s ease",
          position: "relative",
          zIndex: 1,
          "&:hover": {
            boxShadow: "0 6px 8px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          sx={{
            pb: 2,
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "white",
              fontSize: { xs: "1rem", sm: "1.1rem" },
              letterSpacing: "0.5px",
            }}
          >
            {column.title}
          </Typography>
          <Box>
            <IconButton
              onClick={handleDeleteColumn}
              size="small"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "#ef4444",
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={handleOpenNewCardDialog}
              size="small"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "#3182ce",
                },
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        <Box
          sx={{
            minHeight: "50px",
            maxHeight: "calc(100vh - 250px)",
            overflowY: "auto",
            px: 1,
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "3px",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.2)",
              },
            },
            "&.droppable-active": {
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              borderRadius: "8px",
              transition: "background-color 0.2s ease",
            },
          }}
        >
          {columnCards.map((card, index) => (
            <CardItem
              key={card.id}
              card={card}
              index={index}
              onEdit={handleEditCard}
              onDelete={handleDeleteCard}
            />
          ))}
          {provided.placeholder}
        </Box>
      </Paper>

      <Dialog
        open={isNewCardDialogOpen}
        onClose={handleCloseNewCardDialog}
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
          Nueva Tarjeta
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2, backgroundColor: "#1a202c" }}>
          <TextField
            autoFocus
            margin="dense"
            label="Título de la tarjeta"
            fullWidth
            value={newCard.title}
            onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
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
            value={newCard.description}
            onChange={(e) =>
              setNewCard({ ...newCard, description: e.target.value })
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
            onClick={handleCloseNewCardDialog}
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
            onClick={handleAddCard}
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
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Column;
