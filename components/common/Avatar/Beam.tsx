import React from 'react'
import {
  getNumber,
  getUnit,
  getBoolean,
  getRandomColor,
  getContrast,
} from './utility'
import Svg, { Mask, Rect, G, Path } from 'react-native-svg'

const SIZE = 36

function generateData(name: string, colors: string[]) {
  const numFromName = getNumber(name)
  const range = colors && colors.length
  const wrapperColor = getRandomColor(numFromName, colors, range)
  const preTranslateX = getUnit(numFromName, 10, 1)
  const wrapperTranslateX =
    preTranslateX < 5 ? preTranslateX + SIZE / 9 : preTranslateX
  const preTranslateY = getUnit(numFromName, 10, 2)
  const wrapperTranslateY =
    preTranslateY < 5 ? preTranslateY + SIZE / 9 : preTranslateY

  const data = {
    wrapperColor: wrapperColor,
    faceColor: getContrast(wrapperColor),
    backgroundColor: getRandomColor(numFromName + 13, colors, range),
    wrapperTranslateX: wrapperTranslateX,
    wrapperTranslateY: wrapperTranslateY,
    wrapperRotate: getUnit(numFromName, 360),
    wrapperScale: 1 + getUnit(numFromName, SIZE / 12) / 10,
    isMouthOpen: getBoolean(numFromName, 2),
    isCircle: getBoolean(numFromName, 1),
    eyeSpread: getUnit(numFromName, 5),
    mouthSpread: getUnit(numFromName, 3),
    faceRotate: getUnit(numFromName, 10, 3),
    faceTranslateX:
      wrapperTranslateX > SIZE / 6
        ? wrapperTranslateX / 2
        : getUnit(numFromName, 8, 1),
    faceTranslateY:
      wrapperTranslateY > SIZE / 6
        ? wrapperTranslateY / 2
        : getUnit(numFromName, 7, 2),
  }

  return data
}

export default function Beam({
  size = 40,
  name,
  square = false,
  colors = ['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90'],
}: {
  size?: number
  name: string
  square?: boolean
  colors?: string[]
}) {
  const data = generateData(name, colors)

  return (
    <Svg
      viewBox={'0 0 ' + SIZE + ' ' + SIZE}
      fill="none"
      width={size}
      height={size}
    >
      <Mask
        id="mask__beam"
        maskUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={SIZE}
        height={SIZE}
      >
        <Rect
          width={SIZE}
          height={SIZE}
          rx={square ? undefined : SIZE * 2}
          fill="white"
        />
      </Mask>
      <G mask="url(#mask__beam)">
        <Rect width={SIZE} height={SIZE} fill={data.backgroundColor} />
        <Rect
          x="0"
          y="0"
          width={SIZE}
          height={SIZE}
          transform={
            'translate(' +
            data.wrapperTranslateX +
            ' ' +
            data.wrapperTranslateY +
            ') rotate(' +
            data.wrapperRotate +
            ' ' +
            SIZE / 2 +
            ' ' +
            SIZE / 2 +
            ') scale(' +
            data.wrapperScale +
            ')'
          }
          fill={data.wrapperColor}
          rx={data.isCircle ? SIZE : SIZE / 6}
        />
        <G
          transform={
            'translate(' +
            data.faceTranslateX +
            ' ' +
            data.faceTranslateY +
            ') rotate(' +
            data.faceRotate +
            ' ' +
            SIZE / 2 +
            ' ' +
            SIZE / 2 +
            ')'
          }
        >
          {data.isMouthOpen ? (
            <Path
              d={'M15 ' + (19 + data.mouthSpread) + 'c2 1 4 1 6 0'}
              stroke={data.faceColor}
              fill="none"
              strokeLinecap="round"
            />
          ) : (
            <Path
              d={'M13,' + (19 + data.mouthSpread) + ' a1,0.75 0 0,0 10,0'}
              fill={data.faceColor}
            />
          )}
          <Rect
            x={14 - data.eyeSpread}
            y={14}
            width={1.5}
            height={2}
            rx={1}
            stroke="none"
            fill={data.faceColor}
          />
          <Rect
            x={20 + data.eyeSpread}
            y={14}
            width={1.5}
            height={2}
            rx={1}
            stroke="none"
            fill={data.faceColor}
          />
        </G>
      </G>
    </Svg>
  )
}
