export interface User {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
  }
  
  // Interface for the reactions object
export interface Reactions {
    url: string;
    total_count: number;
    '+1': number;
    '-1': number;
    laugh: number;
    hooray: number;
    confused: number;
    heart: number;
    rocket: number;
    eyes: number;
  }
  
  // Interface for the GitHub issue
export interface GitHubIssue {
    id: number;
    node_id: string;
    number: number;
    title: string;
    user: User;
    state: string;
    locked: boolean;
    assignee: User | null;
    assignees: User[];
    milestone: null | object;
    comments: number;
    created_at: string;
    updated_at: string;
    closed_at: string | null;
    author_association: string;
    body: string;
    reactions: Reactions;
    url: string;
    html_url: string;
    labels: string[];
    repository_url: string;
    comments_url: string;
    events_url: string;
    timeline_url: string;
  }

  export interface BountyForm {
    issueId: string;
    ownerId: string;
    repositoryId: string;
    description: string;
    title: string;
    bountyAmount:string;
}