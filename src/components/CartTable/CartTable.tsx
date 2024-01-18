import React from "react";
import { ListGroup, ListGroupItem, Button } from "react-bootstrap";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

interface DragAndDropListProps {
  transfersOrder: { [passport: string]: number };
  deleteFromCart: (passportName: string) => (event: React.MouseEvent) => void;
  onDragEnd: (result: any) => void;
}

const CartTable: React.FC<DragAndDropListProps> = ({
  transfersOrder,
  deleteFromCart,
  onDragEnd,
}) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="transfersOrder">
        {(provided) => (
          <ListGroup style={{ width: "500px" }} ref={provided.innerRef} {...provided.droppableProps}>
            {Object.entries(transfersOrder).map(([passportName, transferOrder], index) => (
              <Draggable key={passportName} draggableId={passportName} index={index}>
                {(provided, snapshot) => (
                  <ListGroupItem
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {passportName}
                    <span className="delete-button">
                      <Button variant="danger" onClick={deleteFromCart(passportName)}>
                        Удалить
                      </Button>
                    </span>
                  </ListGroupItem>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ListGroup>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default CartTable;