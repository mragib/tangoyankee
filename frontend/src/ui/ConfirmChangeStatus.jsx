import styled from "styled-components";
import Button from "./Button";
import Heading from "./Heading";
import { capitalizeFirstLetter } from "../util";

const StyledConfirmDelete = styled.div`
  width: 40rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  & p {
    color: var(--color-grey-500);
    margin-bottom: 1.2rem;
  }

  & div {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

function ConfirmChangeStatus({
  resource,
  onConfirm,
  disabled,
  onCloseModal,
  action,
}) {
  // function handleConfirmClick() {}

  return (
    <StyledConfirmDelete>
      <Heading type="h3">
        {capitalizeFirstLetter(action)} {resource}
      </Heading>
      <p>
        Are you sure you want to {action} this {resource}?.
      </p>

      <div>
        <Button variation="secondary" onClick={onCloseModal}>
          Cancel
        </Button>
        <Button
          variation={action === "Inactive" ? "danger" : "tertiary"}
          onClick={() => {
            onConfirm();
            onCloseModal();
          }}
          disabled={disabled}
        >
          {capitalizeFirstLetter(action)}
        </Button>
      </div>
    </StyledConfirmDelete>
  );
}

export default ConfirmChangeStatus;
