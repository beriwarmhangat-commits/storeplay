import UploadAppClient from './UploadAppClient'

export default async function UploadAppPage({ searchParams }: { searchParams: Promise<{ message?: string, type?: string }> }) {
  const params = await searchParams
  const message = params?.message
  const type = params?.type || 'error'

  return <UploadAppClient message={message} type={type} />
}
