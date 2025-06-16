// DraggableCardList.js
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Sample data
const initialCards = [
  { id: Math.random().toString(36).substring(2, 15), content: "Card 1" },
  { id: Math.random().toString(36).substring(2, 15), content: "Card 2" },
  { id: Math.random().toString(36).substring(2, 15), content: "Card 3" },
];

const DraggableCardList = () => {
  const [cards, setCards] = useState(initialCards);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // If dropped outside the list
    if (!destination) {
      return;
    }

    // Reorder the cards
    const reorderedCards = Array.from(cards);
    const [movedCard] = reorderedCards.splice(source.index, 1);
    reorderedCards.splice(destination.index, 0, movedCard);

    setCards(reorderedCards);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ padding: "8px", width: "250px" }}
          >
            {cards.map((card, index) => (
              <Draggable key={card.id} draggableId={card.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      userSelect: "none",
                      padding: "16px",
                      margin: "0 0 8px 0",
                      background: "lightgrey",
                      borderRadius: "4px",
                      ...provided.draggableProps.style,
                    }}
                  >
                    {card.content}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableCardList;
