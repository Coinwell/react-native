import { DetailsStore } from 'store2/details-store'
import { relay } from 'api'

export async function getVersions(_: DetailsStore): Promise<any> {
  try {
    const r = await relay.get('app_versions')
    if (r) return r
  } catch (e) {
    console.log(e)
  }
}
