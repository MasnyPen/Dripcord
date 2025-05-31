export default function date(): string {
  const data = new Date()

  return `${data.getFullYear()}-${
    data.getUTCMonth() + 1
  }-${data.getUTCDate()}T${data.getHours()}:${data.getMinutes()}:${data.getSeconds()}`
}
