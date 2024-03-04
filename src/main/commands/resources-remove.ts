import path from 'path';
import {
  lookupResource,
  removeResource,
  getResourcePath,
  updateActivity,
} from '../store';
import fs from 'fs';
import { resourcesList } from './resources-list';

export function resourcesRemove(hash: string) {
  const resource = lookupResource(hash);
  const defaultResourcePath = getResourcePath(resource.type);
  const timestamp = new Date().toISOString();
  const resourcePath =
    resource.localPath || path.join(defaultResourcePath, resource.name);

  try {
    // Remove from disk
    fs.unlinkSync(resourcePath);
  } catch (e) {
    console.error('Error removing resource from disk', e);
  }

  // Remove from resources and activity
  removeResource(hash);

  const activity: ActivityItem = {
    name: resource.modelName,
    date: timestamp,
    type: 'deleted' as ActivityType,
    civitaiUrl: resource.civitaiUrl,
  };

  updateActivity(activity);

  // Return resource list
  return resourcesList();
}
