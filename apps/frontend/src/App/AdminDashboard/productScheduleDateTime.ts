const isoDatePattern = /^(\d{4})-(\d{2})-(\d{2})/

export const dateValueToDateInput = (dateValue: { toString: () => string }) =>
  dateValue.toString().slice(0, 10)

// TODO: I think the backed should handle this conversion by accepting
export const scheduleInputToIso = (
  scheduleDate: string,
  scheduleTime: string,
) => {
  const dateMatch = isoDatePattern.exec(scheduleDate.trim())
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(scheduleTime.trim())

  if (!dateMatch || !timeMatch) {
    throw new Error('Choose a valid schedule date and time.')
  }

  const [, year, month, day] = dateMatch
  const [, hour, minute] = timeMatch
  const scheduledAt = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    0,
    0,
  )

  if (Number.isNaN(scheduledAt.getTime())) {
    throw new Error('Choose a valid schedule date and time.')
  }

  return scheduledAt.toISOString()
}
