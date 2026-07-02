const padDatePart = (value: number) => String(value).padStart(2, '0')

const formatDateInput = (date: Date) =>
  [
    date.getFullYear(),
    padDatePart(date.getMonth() + 1),
    padDatePart(date.getDate()),
  ].join('-')

export const defaultScheduleValues = () => {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  date.setHours(9, 0, 0, 0)

  return {
    date: formatDateInput(date),
    time: '09:00',
  }
}
