import styled, { css } from "styled-components";

const Label = styled.p`
  ${(props) =>
    props.as === "sm" &&
    css`
      font-size: 1rem;
    `}
  ${(props) =>
    props.as === "md" &&
    css`
      font-size: 1.6rem;
    `}
    ${(props) =>
    props.as === "lg" &&
    css`
      font-size: 2rem;
    `}
    ${(props) =>
    props.as === "xl" &&
    css`
      font-size: 3.2rem;
    `}
    display:block;
  line-height: 1.5;
`;

export default Label;
