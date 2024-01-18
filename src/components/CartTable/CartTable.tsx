import React from "react";
import { ListGroup, ListGroupItem, Button } from "react-bootstrap";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { RxDragHandleHorizontal } from "react-icons/rx";

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
            {Object.entries(transfersOrder).map(([passportName], index) => (
              <Draggable key={passportName} draggableId={passportName} index={index}>
                {(provided) => (
                  <ListGroupItem
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <span className="drag-handle">
                      <RxDragHandleHorizontal style={{marginTop:'5px'}}size={30}/>
                    </span>
                    <div style={{fontSize:'20px', marginTop:'5px', marginLeft:'5px'}}>{passportName}</div>
                    <span className="delete-button">
                    <Button variant="danger" style={{marginTop:'0px'}} onClick={deleteFromCart(passportName)}>
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