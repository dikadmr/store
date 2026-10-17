import { addData, retrieveDataById, updateData } from "./service";

export async function createProject(
  projectData: Record<string, unknown>,
): Promise<string> {
  const projectId = await addData("projects", projectData);

  return projectId;
}

export async function getProject(projectId: string) {
  return retrieveDataById("projects", projectId);
}

export async function updateProject(
  projectId: string,
  data: Record<string, unknown>,
): Promise<void> {
  await updateData("projects", projectId, data);
}
