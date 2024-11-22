import styled from "styled-components";

import { formatCurrency } from "../../helper/formatDate";
import Tag from "@/ui/Tag";

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 600;
  }

  & span:last-child {
    color: var(--color-red-800);
    font-size: 1.2rem;
    font-weight: 600;
  }
`;

function SupplierLedger({ payment, purchase }) {
  const totalAmount = purchase.reduce((acc, curr) => curr.totalAmount + acc, 0);
  const totalPaid = payment.reduce((acc, curr) => curr.amountPaid + acc, 0);
  return (
    <Stacked>
      <Tag type="green">Total Amount: {formatCurrency(totalAmount)}</Tag>
      <Tag type="blue">Total Paid: {formatCurrency(totalPaid)}</Tag>
      <Tag type="red">
        Total Payable: {formatCurrency(totalAmount - totalPaid)}
      </Tag>
    </Stacked>
  );
}

export default SupplierLedger;
