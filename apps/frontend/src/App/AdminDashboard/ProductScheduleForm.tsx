import type { ChangeEvent } from 'react'
import {
  Button,
  DatePicker,
  Input,
  Portal,
  parseDate,
  type DateValue,
} from '@chakra-ui/react'
import { LuCalendar } from 'react-icons/lu'
import styled from 'styled-components'
import { dateValueToDateInput } from './productScheduleDateTime'

type ProductScheduleFormProps = {
  label: string
  hint: string
  scheduleDate: string
  scheduleTime: string
  onScheduleDateChange: (date: string) => void
  onScheduleTimeChange: (time: string) => void
  buttonLabel?: string
  onSchedule?: () => void
  disabled?: boolean
}

export function ProductScheduleForm({
  label,
  hint,
  scheduleDate,
  scheduleTime,
  onScheduleDateChange,
  onScheduleTimeChange,
  buttonLabel,
  onSchedule,
  disabled = false,
}: ProductScheduleFormProps) {
  const datePickerValue = dateInputToDatePickerValue(scheduleDate)
  const triggerLabel =
    formatScheduleTriggerLabel(scheduleDate, scheduleTime) ??
    'Select date and time'
  const handleDateChange = (details: { value: DateValue[] }) => {
    const nextDate = details.value[0]

    if (nextDate) {
      onScheduleDateChange(dateValueToDateInput(nextDate))
    }
  }
  const handleTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    onScheduleTimeChange(event.currentTarget.value)
  }

  return (
    <ScheduleGroup>
      <ScheduleRow $hasButton={Boolean(buttonLabel && onSchedule)}>
        <DatePicker.Root
          value={datePickerValue}
          disabled={disabled}
          closeOnSelect={false}
          positioning={{ sameWidth: true }}
          onValueChange={handleDateChange}
        >
          <DatePicker.Label>{label}</DatePicker.Label>
          <DatePicker.Control>
            <DatePicker.Trigger asChild unstyled>
              <Button
                type="button"
                variant="outline"
                width="100%"
                justifyContent="space-between"
                disabled={disabled}
              >
                <span>{triggerLabel}</span>
                <LuCalendar />
              </Button>
            </DatePicker.Trigger>
          </DatePicker.Control>
          <Portal>
            <DatePickerPositioner>
              <DatePickerContent>
                <DatePicker.View view="day">
                  <DatePicker.Header />
                  <DatePicker.DayTable />
                  <TimeInput
                    type="time"
                    value={scheduleTime}
                    disabled={disabled}
                    onChange={handleTimeChange}
                  />
                </DatePicker.View>
              </DatePickerContent>
            </DatePickerPositioner>
          </Portal>
        </DatePicker.Root>

        {buttonLabel && onSchedule ? (
          <Button
            type="button"
            colorPalette="green"
            size="sm"
            disabled={disabled}
            onClick={onSchedule}
          >
            {buttonLabel}
          </Button>
        ) : null}
      </ScheduleRow>
      <Hint>{hint}</Hint>
    </ScheduleGroup>
  )
}

const dateInputToDatePickerValue = (scheduleDate: string) => {
  try {
    return scheduleDate ? [parseDate(scheduleDate)] : []
  } catch {
    return []
  }
}

const formatScheduleTriggerLabel = (
  scheduleDate: string,
  scheduleTime: string,
) => {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(scheduleDate)
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(scheduleTime)

  if (!dateMatch || !timeMatch) return null

  const [, year, month, day] = dateMatch
  const [, hour, minute] = timeMatch
  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
  )

  if (Number.isNaN(date.getTime())) return null

  return scheduleTriggerFormatter.format(date)
}

const scheduleTriggerFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

const ScheduleGroup = styled.div`
  margin-top: 16px;
`

const ScheduleRow = styled.div<{ $hasButton: boolean }>`
  display: grid;
  grid-template-columns: ${({ $hasButton }) =>
    $hasButton ? 'minmax(0, 1fr) auto' : 'minmax(0, 1fr)'};
  gap: 8px;

  [data-part='root'] {
    min-width: 0;
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`

const Hint = styled.p`
  margin: 6px 0 0;
  color: #667085;
  font-size: 12px;
`

const DatePickerPositioner = styled(DatePicker.Positioner)`
  z-index: var(--chakra-z-index-popover, 1500);
`

const DatePickerContent = styled(DatePicker.Content)`
  z-index: var(--chakra-z-index-popover, 1500);
`

const TimeInput = styled(Input)`
  margin-top: 10px;
`
