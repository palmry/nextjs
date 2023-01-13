import React from 'react'
import { ScAdSlotInContent } from '../../components/AdProviderWrapper'
import { AdSlot } from 'wildsky-components'
import ConnatixPlayer from 'wsc/components/post/ConnatixPlayer'

const pmpSlot1Position = 0
const externalPlayerPosition = 0
const slot1Position = 2
const slot2Position = 7
const slotXStartPosition = 12
const slotXInterval = 5

let slots = {}

const renderInContentSlot = (slot, options, args) => {
  return (
    <ScAdSlotInContent>
      <AdSlot
        au3={slot}
        teardown={options.teardown === undefined ? true : !!options.teardown}
        appendId={options.appendId || ''}
        targeting={options.targeting || false}
        {...args}
      />
    </ScAdSlotInContent>
  )
}

export const resetIncontentSlots = () => {
  slots = {}
}

export const getIncontentSlots = () => {
  return slots
}

export const PmpSlot1Injector = (index, paragraph, options) => {
  if (index === pmpSlot1Position) {
    const slot = 'pmp_slot_1'
    slots[slot] = 1
    return {
      before: renderInContentSlot(slot, options),
    }
  }
}

export const ConnatixInjector = (index, paragraph, options) => {
  if (index === externalPlayerPosition) {
    return {
      after: <ConnatixPlayer />,
    }
  }
}

export const IncontentSlot1Injector = (index, paragraph, options) => {
  if (index === slot1Position) {
    const slot = 'inContent_slot_1'
    slots[slot] = 1
    return {
      before: renderInContentSlot(slot, options),
    }
  }
}

export const IncontentSlot2Injector = (index, paragraph, options) => {
  if (index === slot2Position) {
    const slot = 'inContent_slot_2'
    slots[slot] = 1
    return {
      before: renderInContentSlot(slot, options),
    }
  }
}

export const IncontentSlotXInjector = (index, paragraph, options) => {
  const start = index - slotXStartPosition
  if (start >= 0 && start % slotXInterval === 0) {
    const slot = 'inContent_slot_x'
    const extraConfig = { number: start / slotXInterval }
    if (slot in slots) {
      slots[slot]++
    } else {
      slots[slot] = 1
    }
    return {
      before: renderInContentSlot(slot, options, extraConfig),
    }
  }
}

export default [
  IncontentSlot1Injector,
  IncontentSlot2Injector,
  IncontentSlotXInjector,
  PmpSlot1Injector,
]
