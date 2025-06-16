// // SortableCardList.js
// import React from "react";
// import {
//   DndContext,
//   DragEndEvent,
//   useDraggable,
//   useDroppable,
// } from "@dnd-kit/core";
// import {
//   SortableContext,
//   verticalListSortingStrategy,
//   arrayMove,
// } from "@dnd-kit/sortable";
// import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

// const initialCards = [
//   { id: "1", content: "Card 1" },
//   { id: "2", content: "Card 2" },
//   { id: "3", content: "Card 3" },
// ];

// const SortableItem = ({ id, content }) => {
//   const { attributes, listeners, setNodeRef, transform, transition } =
//     useDraggable({
//       id,
//     });

//   return (
//     <div
//       ref={setNodeRef}
//       {...attributes}
//       {...listeners}
//       style={{
//         transform: `translate3d(${transform?.x}px, ${transform?.y}px, 0)`,
//         transition,
//         padding: "16px",
//         margin: "0 0 8px 0",
//         background: "lightgrey",
//         borderRadius: "4px",
//         userSelect: "none",
//       }}
//     >
//       {content}
//     </div>
//   );
// };

// const SortableCardList = () => {
//   const [cards, setCards] = React.useState(initialCards);

//   const handleDragEnd = (event) => {
//     const { active, over } = event;

//     if (active.id !== over.id) {
//       const oldIndex = cards.findIndex((card) => card.id === active.id);
//       const newIndex = cards.findIndex((card) => card.id === over.id);

//       setCards((items) => arrayMove(items, oldIndex, newIndex));
//     }
//   };

//   return (
//     <DndContext
//       onDragEnd={handleDragEnd}
//       collisionDetection={sortableKeyboardCoordinates}
//     >
//       <SortableContext
//         items={cards.map((card) => card.id)}
//         strategy={verticalListSortingStrategy}
//       >
//         <div style={{ padding: "8px", width: "250px" }}>
//           {cards.map((card) => (
//             <SortableItem key={card.id} id={card.id} content={card.content} />
//           ))}
//         </div>
//       </SortableContext>
//     </DndContext>
//   );
// };

// export default SortableCardList;
import React from 'react'

const SortableCardList = () => {
  return (
    <div>SortableCardList</div>
  )
}

export default SortableCardList