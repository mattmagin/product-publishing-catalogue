import { DatePicker } from '@ark-ui/react/date-picker'
import { Portal } from '@ark-ui/react/portal'
import styled from 'styled-components'

type ProductScheduleFormProps = {
  scheduleDate: string
  scheduleTime: string
  onScheduleDateChange: (date: string) => void
  onScheduleTimeChange: (time: string) => void
  disabled?: boolean
}

export function ProductScheduleForm({
  scheduleDate,
  scheduleTime,
  onScheduleDateChange,
  onScheduleTimeChange,
  disabled = false,
}: ProductScheduleFormProps) {
  return (
    <ScheduleGroup>
      <FieldLabel>Schedule publish</FieldLabel>
      <ScheduleRow>
        <DatePicker.Root
          disabled={disabled}
          positioning={{ sameWidth: true }}
          onValueChange={(details) => {
            const nextDate = details.valueAsString[0]
            if (nextDate) {
              onScheduleDateChange(nextDate)
            }
          }}
        >
          <DatePicker.Control className="date-control">
            <DatePicker.Input
              className="date-input"
              index={0}
              value={scheduleDate}
              readOnly
            />
            <DatePicker.Trigger className="date-trigger">
              Calendar
            </DatePicker.Trigger>
          </DatePicker.Control>
          <Portal>
            <DatePicker.Positioner>
              <DatePickerContent>
                <DatePicker.View view="day">
                  <DatePicker.Context>
                    {(datePicker) => (
                      <>
                        <CalendarHeader>
                          <DatePicker.PrevTrigger>&lt;</DatePicker.PrevTrigger>
                          <DatePicker.ViewTrigger>
                            <DatePicker.RangeText />
                          </DatePicker.ViewTrigger>
                          <DatePicker.NextTrigger>&gt;</DatePicker.NextTrigger>
                        </CalendarHeader>
                        <DatePicker.Table>
                          <DatePicker.TableHead>
                            <DatePicker.TableRow>
                              {datePicker.weekDays.map((weekDay, id) => (
                                <DatePicker.TableHeader key={id}>
                                  {weekDay.short}
                                </DatePicker.TableHeader>
                              ))}
                            </DatePicker.TableRow>
                          </DatePicker.TableHead>
                          <DatePicker.TableBody>
                            {datePicker.weeks.map((week, weekIndex) => (
                              <DatePicker.TableRow key={weekIndex}>
                                {week.map((day, dayIndex) => (
                                  <DatePicker.TableCell
                                    key={dayIndex}
                                    value={day}
                                  >
                                    <DatePicker.TableCellTrigger>
                                      {day.day}
                                    </DatePicker.TableCellTrigger>
                                  </DatePicker.TableCell>
                                ))}
                              </DatePicker.TableRow>
                            ))}
                          </DatePicker.TableBody>
                        </DatePicker.Table>
                      </>
                    )}
                  </DatePicker.Context>
                </DatePicker.View>
              </DatePickerContent>
            </DatePicker.Positioner>
          </Portal>
        </DatePicker.Root>

        <TimeInput
          type="time"
          value={scheduleTime}
          disabled={disabled}
          onChange={(event) => onScheduleTimeChange(event.currentTarget.value)}
        />
        <ScheduleButton type="button" disabled={disabled}>
          Schedule
        </ScheduleButton>
      </ScheduleRow>
      <Hint>Set a future date and time for this product to go live.</Hint>
    </ScheduleGroup>
  )
}

const ScheduleGroup = styled.div`
  margin-top: 16px;
`

const FieldLabel = styled.label`
  display: block;
  margin-bottom: 6px;
  color: #344054;
  font-size: 12px;
  font-weight: 700;
`

const ScheduleRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 92px auto;
  gap: 8px;

  .date-control {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .date-input,
  .date-trigger {
    min-height: 34px;
    border: 1px solid #d9dee8;
    background: #ffffff;
    color: #111827;
    font: inherit;
    font-size: 13px;
  }

  .date-input {
    min-width: 0;
    border-radius: 4px 0 0 4px;
    padding: 0 10px;
  }

  .date-trigger {
    border-left: 0;
    border-radius: 0 4px 4px 0;
    padding: 0 10px;
    cursor: pointer;
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;

    .date-control {
      grid-template-columns: 1fr;
    }

    .date-input,
    .date-trigger {
      border: 1px solid #d9dee8;
      border-radius: 4px;
    }
  }
`

const TimeInput = styled.input`
  min-width: 0;
  min-height: 34px;
  border: 1px solid #d9dee8;
  border-radius: 4px;
  padding: 0 8px;
  background: #ffffff;
  color: #111827;
  font: inherit;
  font-size: 13px;
`

const BaseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  border-radius: 4px;
  padding: 0 14px;
  font: inherit;
  font-size: 13px;
  font-weight: 650;
  cursor: pointer;

  &:disabled {
    opacity: 0.48;
    cursor: default;
  }
`

const ScheduleButton = styled(BaseButton)`
  border: 1px solid #059669;
  background: #059669;
  color: #ffffff;

  &:hover:not(:disabled) {
    background: #047857;
  }
`

const Hint = styled.p`
  margin: 6px 0 0;
  color: #667085;
  font-size: 12px;
`

const DatePickerContent = styled(DatePicker.Content)`
  padding: 12px;
  border: 1px solid #d9dee8;
  border-radius: 4px;
  background: #ffffff;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.16);
  z-index: 30;

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th {
    padding: 6px;
    color: #667085;
    font-size: 11px;
    font-weight: 700;
  }

  td {
    padding: 2px;
  }

  [data-part='cell-trigger'] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 30px;
    border-radius: 4px;
    color: #111827;
    font-size: 12px;
    cursor: pointer;
  }

  [data-part='cell-trigger']:hover {
    background: #eef6ff;
  }

  [data-selected] [data-part='cell-trigger'],
  [data-part='cell-trigger'][data-selected] {
    background: #2684ff;
    color: #ffffff;
  }
`

const CalendarHeader = styled(DatePicker.ViewControl)`
  display: grid;
  grid-template-columns: 32px 1fr 32px;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;

  button {
    min-height: 30px;
    border: 1px solid #d9dee8;
    border-radius: 4px;
    background: #ffffff;
    color: #344054;
    font: inherit;
    font-size: 12px;
    cursor: pointer;
  }
`
