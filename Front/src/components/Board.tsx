import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import Column from "./Column";
import { Card, Column as ColumnType } from "../types/kanban";
import axios from "axios";
import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CardItem from "./CardItem";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const Board = () => {
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [isNewColumnDialogOpen, setIsNewColumnDialogOpen] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  useEffect(() => {
    fetchColumns();
    fetchCards();

    const socket = io(API_URL);

    socket.on("columnUpdated", (updatedColumn) => {
      setColumns((prev) =>
        prev.map((col) => (col.id === updatedColumn.id ? updatedColumn : col)),
      );
      toast.info("Columna actualizada");
    });

    socket.on("cardUpdated", (updatedCard) => {
      setCards((prev) =>
        prev.map((card) => (card.id === updatedCard.id ? updatedCard : card)),
      );
      toast.info("Tarjeta actualizada");
    });

    socket.on("cardMoved", (data) => {
      setCards((prev) =>
        prev.map((card) => {
          if (card.id === data.cardId) {
            return {
              ...card,
              columnId: data.newColumnId,
              position: data.newPosition,
            };
          }
          return card;
        }),
      );
      toast.info("Tarjeta movida");
    });

    socket.on("columnAdded", (newColumn) => {
      setColumns((prev) => [...prev, newColumn]);
      toast.success("Nueva columna agregada");
    });

    socket.on("columnDeleted", (columnId) => {
      setColumns((prev) => prev.filter((col) => col.id !== columnId));
      setCards((prev) => prev.filter((card) => card.columnId !== columnId));
      toast.info("Columna eliminada");
    });

    socket.on("cardAdded", (newCard) => {
      setCards((prev) => [...prev, newCard]);
      toast.success("Nueva tarjeta agregada");
    });

    socket.on("cardDeleted", (cardId) => {
      setCards((prev) => prev.filter((card) => card.id !== cardId));
      toast.info("Tarjeta eliminada");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchColumns = async () => {
    try {
      const response = await axios.get(`${API_URL}/columns`);
      setColumns(response.data);
    } catch (error) {
      console.error("Error fetching columns:", error);
      toast.error("Error al cargar las columnas");
    }
  };

  const fetchCards = async () => {
    try {
      const response = await axios.get(`${API_URL}/cards`);
      setCards(response.data);
    } catch (error) {
      console.error("Error fetching cards:", error);
      toast.error("Error al cargar las tarjetas");
    }
  };

  const handleOpenNewColumnDialog = () => {
    setIsNewColumnDialogOpen(true);
  };

  const handleCloseNewColumnDialog = () => {
    setIsNewColumnDialogOpen(false);
    setNewColumnTitle("");
  };

  const addColumn = async () => {
    if (!newColumnTitle.trim()) {
      toast.warning("Por favor, ingresa un título para la columna");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/columns`, {
        title: newColumnTitle.trim(),
        position: columns.length,
      });
      setColumns((prev) => [...prev, response.data]);
      handleCloseNewColumnDialog();
      toast.success("Columna creada exitosamente");
    } catch (error) {
      console.error("Error adding column:", error);
      toast.error("Error al crear la columna");
    }
  };

  const deleteColumn = async (columnId: string) => {
    try {
      await axios.delete(`${API_URL}/columns/${columnId}`);
      setColumns((prev) => prev.filter((col) => col.id !== columnId));
      setCards((prev) => prev.filter((card) => card.columnId !== columnId));
      toast.success("Columna eliminada exitosamente");
    } catch (error) {
      console.error("Error deleting column:", error);
      toast.error("Error al eliminar la columna");
    }
  };

  const deleteCard = async (cardId: string) => {
    try {
      await axios.delete(`${API_URL}/cards/${cardId}`);
      setCards((prev) => prev.filter((card) => card.id !== cardId));
      toast.success("Tarjeta eliminada exitosamente");
    } catch (error) {
      console.error("Error deleting card:", error);
      toast.error("Error al eliminar la tarjeta");
    }
  };

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId, type } = result;

   
    if (!destination) return;

    
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "card") {
      // aca encuentramos las columnas de origen y destino
      const sourceColumn = columns.find((col) => col.id === source.droppableId);
      const destColumn = columns.find((col) => col.id === destination.droppableId);

      if (!sourceColumn || !destColumn) return;

      
      const sourceCards = cards.filter(
        (card) => card.columnId === source.droppableId,
      );
      const [movedCard] = sourceCards.splice(source.index, 1);

     
      const updatedSourceCards = sourceCards.map((card, index) => ({
        ...card,
        position: index,
      }));

   
      const destCards = cards.filter(
        (card) => card.columnId === destination.droppableId,
      );
      destCards.splice(destination.index, 0, {
        ...movedCard,
        columnId: destination.droppableId,
        position: destination.index,
      });

      const updatedDestCards = destCards.map((card, index) => ({
        ...card,
        position: index,
      }));

     
      const updatedCards = cards
        .filter(
          (card) =>
            card.columnId !== source.droppableId &&
            card.columnId !== destination.droppableId,
        )
        .concat(updatedSourceCards, updatedDestCards);

      // Actualiza el estado local
      setCards(updatedCards);

      try {
        // Actualizamos el backend con la nueva posición de la tarjeta
        await axios.patch(`${API_URL}/cards/${draggableId}`, {
          columnId: destination.droppableId,
          position: destination.index,
        });
        toast.success("Tarjeta movida exitosamente");
      } catch (error) {
        console.error("Error moving card:", error);
        toast.error("Error al mover la tarjeta");
        setCards(cards); // Revertir al estado anterior en caso de error
      }
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2, md: 3 },
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a365d 0%, #2d3748 100%)",
        backgroundAttachment: "fixed",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 25%, transparent 50%)",
          pointerEvents: "none",
        },
      }}
    >
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ fontSize: "14px" }}
      />
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Button
          variant="contained"
          onClick={handleOpenNewColumnDialog}
          sx={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            textTransform: "none",
            fontSize: "15px",
            fontWeight: 500,
            letterSpacing: "0.3px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            transition: "all 0.2s ease",
            "&:hover": {
              background: "rgba(255, 255, 255, 0.2)",
              transform: "translateY(-1px)",
              boxShadow: "0 6px 8px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          + Nueva Columna
        </Button>
      </Box>

      <DragDropContext onDragEnd={onDragEnd}>
        <Box
          sx={{
            display: "flex",
            gap: 3,
            overflowX: "auto",
            pb: 3,
            px: 1,
            minHeight: "calc(100vh - 150px)",
            position: "relative",
            zIndex: 1,
            "&::-webkit-scrollbar": {
              height: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "4px",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.3)",
              },
            },
            "& .droppable-active": {
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              borderRadius: "12px",
              transition: "background-color 0.2s ease",
            },
            "& .dragging": {
              zIndex: 9999,
              position: "relative",
            },
          }}
        >
          {columns
            .sort((a, b) => (a.position || 0) - (b.position || 0))
            .map((column) => (
              <Droppable
                key={column.id}
                droppableId={column.id}
                type="card"
                renderClone={(provided, snapshot, rubric) => {
                  const columnCards = cards
                    .filter((card) => card.columnId === column.id)
                    .sort((a, b) => (a.position || 0) - (b.position || 0));
                  const card = columnCards[rubric.source.index];
                  return (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        zIndex: 3000,
                        position: "relative",
                        pointerEvents: "none",
                        opacity: 1,
                      }}
                    >
                      <CardItem
                        card={card}
                        index={rubric.source.index}
                        onEdit={() => {}}
                        onDelete={() => {}}
                      />
                    </div>
                  );
                }}
              >
                {(provided, snapshot) => (
                  <Column
                    column={column}
                    cards={cards}
                    provided={provided}
                    setCards={setCards}
                    setColumns={setColumns}
                    deleteCard={deleteCard}
                    deleteColumn={deleteColumn}
                  />
                )}
              </Droppable>
            ))}
        </Box>
      </DragDropContext>

      <Dialog
        open={isNewColumnDialogOpen}
        onClose={handleCloseNewColumnDialog}
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
          Nueva Columna
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2, backgroundColor: "#1a202c" }}>
          <TextField
            autoFocus
            margin="dense"
            label="Título de la columna"
            fullWidth
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
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
            onClick={handleCloseNewColumnDialog}
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
            onClick={addColumn}
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
    </Box>
  );
};

export default Board;
