import * as React from 'react'

import styled, { keyframes } from 'styled-components'

const BlinkAnimation = keyframes`  
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
`;

const CellRoot = styled.div<{ size: number, isFigure: boolean, isFlash: boolean }>`
  position: relative;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  animation-name: ${props => props.isFlash ? BlinkAnimation : 'none'};
  animation-duration: .5s;
  animation-timing-function: ease;
  animation-iteration-count: infinite;

  &::after {
    position: absolute;
    top: 4px;
    left: 4px;
    right: 3px;
    bottom: 3px;
    content: '';
    display: ${props => props.isFigure ? 'block' : 'none'};
    background-color: #555;
  }

  &::before {
    position: absolute;
    top: 0px;
    left: 0px;
    right: -1px;
    bottom: -1px;
    content: '';
    border: 1px solid #000;
    display: ${props => props.isFigure ? 'block' : 'none'};
  }
`

interface IProps {
  isFigure: boolean
  isFlash: boolean
  size: number
}

export const Cell = (props: IProps) => {
  return <CellRoot
    size={props.size}
    isFlash={props.isFlash}
    isFigure={props.isFigure}
  />
}
