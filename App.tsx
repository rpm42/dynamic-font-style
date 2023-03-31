import React from 'react'
import { useEffect, useState, useRef } from 'react'
import { BehaviorSubject, map, Subject } from 'rxjs'
import './style.css'
import { createGlobalStyle } from 'styled-components'
import { isBrowser, useBehaviorSubject, useObservable } from './utils'

const FONTS_FAMILY_LIST = [
  'Lato, sans',
  'Roboto, sans',
  '"Roboto Slab", sans-serif',
  '"Noto Serif", sans-serif'
]

class AppContext {
  fontSize$ = new BehaviorSubject<number>(16)
  lineHeight$ = new BehaviorSubject<number>(1.5)
  fontFamilyIndex$ = new BehaviorSubject<number>(0)
  fontFamily$ = this.fontFamilyIndex$.pipe(map(index => FONTS_FAMILY_LIST[index]))
}

const appCtx = new AppContext()

const Html = createGlobalStyle<{ fontSize: number; lineHeight: number }>`
  html {
    font-size: ${({ fontSize }) => (fontSize / 16) * 100}%;
    line-height: ${({ lineHeight }) => lineHeight};
  }
`

const Body = createGlobalStyle<{ fontFamily: string }>`
  body {
    font-family: ${({ fontFamily }) => fontFamily};
  }
  h1,
  p,
  input {
    font-size: 1em;
  }
`

const GlobalStyle: React.FC<{ fontSize: number; lineHeight: number; fontFamily: string }> = ({
  fontSize,
  lineHeight,
  fontFamily
}) => {
  console.log('Render Global Style', fontSize, lineHeight, fontFamily)
  return (
    <>
      <Html fontSize={fontSize} lineHeight={lineHeight} />
      <Body fontFamily={fontFamily} />
    </>
  )
}

const DynamicStyles: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const [fontSize] = useObservable<number>(appCtx.fontSize$)
  const [lineHeight] = useObservable<number>(appCtx.lineHeight$)
  const [fontFamily] = useObservable<string>(appCtx.fontFamily$)

  useEffect(() => {
    if (isBrowser()) {
      document.body.parentElement.style.fontSize = `${(fontSize / 16) * 100}%`
      document.body.parentElement.style.lineHeight = `${lineHeight}`
      document.body.style.fontFamily = fontFamily
    }
  }, [fontSize, lineHeight, fontFamily])

  return <>{children}</>
}

const useDynamicStyles = (appCtx: AppContext) => {
  const [fontSize] = useObservable<number>(appCtx.fontSize$)
  const [lineHeight] = useObservable<number>(appCtx.lineHeight$)
  const [fontFamily] = useObservable<string>(appCtx.fontFamily$)

  useEffect(() => {
    if (isBrowser()) {
      document.body.parentElement.style.fontSize = `${(fontSize / 16) * 100}%`
      document.body.parentElement.style.lineHeight = `${lineHeight}`
      document.body.style.fontFamily = fontFamily
    }
  }, [fontSize, lineHeight, fontFamily])
}

export default function App() {
  const [fontSize, setFontSize] = useBehaviorSubject(appCtx.fontSize$)
  const [lineHeight, setLineHeight] = useBehaviorSubject(appCtx.lineHeight$)
  const [fontFamilyIndex, setFontFamilyIndex] = useBehaviorSubject(appCtx.fontFamilyIndex$)
  const [fontFamily] = useObservable<string>(appCtx.fontFamily$)

  // useEffect(
  //   () => appCtx.handleStyleChange(fontSize, lineHeight, fontFamily),
  //   [fontSize, lineHeight, fontFamilyIndex]
  // )
  useDynamicStyles(appCtx)

  return (
    <div
      style={{
        position: 'relative',
        foneSize: `${fontSize}px`
      }}
    >
      <h1>Hello StackBlitz!</h1>
      <p>Start editing to see some magic happen :)</p>
      <p>
        Start editing to see some <br />
        magic happen :)
      </p>
      <input
        type="number"
        defaultValue={fontSize}
        onChange={e => setFontSize(parseInt(e.target.value, 10))}
      />
      <br />
      <input
        type="number"
        defaultValue={lineHeight}
        onChange={e => setLineHeight(parseInt(e.target.value, 10))}
      />
      <br />
      <input
        type="number"
        defaultValue={fontFamilyIndex}
        onChange={e => setFontFamilyIndex(parseInt(e.target.value, 10))}
      />
    </div>
  )
}
