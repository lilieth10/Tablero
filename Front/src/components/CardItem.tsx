// src/components/CardItem.tsx
import React from 'react';
import { Card } from '../types/kanban';
import { Draggable, DraggableProvided } from 'react-beautiful-dnd';
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

type Props = {
  card: Card;
  index: number;
  onEdit: (card: Card) => void;
  onDelete: (cardId: string) => void;
};

const CardItem = ({ card, index, onEdit, onDelete }: Props) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editedCard, setEditedCard] = React.useState<Card>(card);

  const handleOpenEditDialog = () => {
    setIsEditDialogOpen(true);
    setEditedCard(card);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  const handleSaveEdit = () => {
    onEdit(editedCard);
    handleCloseEditDialog();
  };

  return (
    <>
      <Draggable draggableId={card.id} index={index}>
        {(provided: DraggableProvided) => (
          <Paper
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            elevation={0}
            sx={{
              p: 2,
              mb: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box flex={1}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: 'white',
                    fontWeight: 500,
                    mb: 1,
                    fontSize: '0.95rem',
                  }}
                >
                  {card.title}
                </Typography>
                {card.description && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.85rem',
                      lineHeight: 1.4,
                    }}
                  >
                    {card.description}
                  </Typography>
                )}
              </Box>
              <Box>
                <IconButton
                  onClick={handleOpenEditDialog}
                  size="small"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: '#3182ce',
                    },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={() => onDelete(card.id)}
                  size="small"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: '#ef4444',
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
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
            background: '#1a202c',
            borderRadius: '12px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            maxWidth: { xs: '90%', sm: '500px' },
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'white',
            fontWeight: 500,
            fontSize: '18px',
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          Editar Tarjeta
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2, backgroundColor: '#1a202c' }}>
          <TextField
            autoFocus
            margin="dense"
            label="Título de la tarjeta"
            fullWidth
            value={editedCard.title}
            onChange={(e) => setEditedCard({ ...editedCard, title: e.target.value })}
            variant="outlined"
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#3182ce',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': {
                  color: '#3182ce',
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
            onChange={(e) => setEditedCard({ ...editedCard, description: e.target.value })}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#3182ce',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': {
                  color: '#3182ce',
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0, backgroundColor: '#1a202c' }}>
          <Button
            onClick={handleCloseEditDialog}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            sx={{
              background: '#3182ce',
              color: 'white',
              textTransform: 'none',
              fontWeight: 500,
              px: 3,
              '&:hover': {
                background: '#2c5282',
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
