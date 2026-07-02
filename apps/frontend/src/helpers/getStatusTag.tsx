import { PublishedTag, UnpublishedTag, ScheduledTag } from '@/components/Tag'

// TODO: we are doing the quick and dirty for now, but we need to fix this later...
const getStatusTag = (status): React.ReactNode => {
  if (status === 'published') return <PublishedTag />
  if (status === 'scheduled') return <ScheduledTag />
  return <UnpublishedTag />
}

export default getStatusTag
