export type CreateCommentDTO = {
  entityType: string;
  entityId: number;
  commentary: string;
};

export type FetchCommentsDTO = {
  entityType: string;
  entityId: number;
  page: number;
};
