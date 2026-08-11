'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import MarkdownEditorField from '@/composites/MarkdownEditorField';
import styles from './page.module.css';

type PostSummary = {
    name: string;
    id: number;
    created: number;
    updated: number | null;
    description: string;
};

type PostDetail = PostSummary & {
    body: string;
    tags: string[];
};

type Draft = {
    name: string;
    description: string;
    tags: string;
    body: string;
    updated: string;
};

type Status =
    | { kind: 'idle' | 'loading' }
    | { kind: 'error' | 'success'; message: string };

const EMPTY_DRAFT: Draft = { name: '', description: '', tags: '', body: '', updated: '' };

export default function Editor() {
    const [posts, setPosts] = useState<PostSummary[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [draft, setDraft] = useState<Draft>(() => ({ ...EMPTY_DRAFT, updated: toDateInputValue(null) }));
    const [status, setStatus] = useState<Status>({ kind: 'idle' });

    useEffect(() => {
        loadPosts();
    }, []);

    const handleBodyChange = useCallback((body: string) => {
        setDraft((current) => ({ ...current, body }));
    }, []);

    async function loadPosts() {
        try {
            setPosts(await fetchPosts());
        } catch {
            setStatus({ kind: 'error', message: 'Could not load the post list.' });
        }
    }

    async function selectPost(id: number) {
        setStatus({ kind: 'loading' });
        try {
            const post = await fetchPost(id);
            setSelectedId(post.id);
            setDraft(toDraft(post));
            setStatus({ kind: 'idle' });
        } catch {
            setStatus({ kind: 'error', message: 'Could not load that post.' });
        }
    }

    function startNewPost() {
        setSelectedId(null);
        setDraft({ ...EMPTY_DRAFT, updated: toDateInputValue(null) });
        setStatus({ kind: 'idle' });
    }

    async function saveDraft(event: FormEvent) {
        event.preventDefault();
        setStatus({ kind: 'loading' });

        try {
            const post =
                selectedId === null
                    ? await createPost(fromDraft(draft))
                    : await updatePost(selectedId, fromDraft(draft));

            setSelectedId(post.id);
            setDraft(toDraft(post));
            setPosts((current) => upsertPost(current, toSummary(post)));
            setStatus({ kind: 'success', message: selectedId === null ? 'Post created.' : 'Post updated.' });
        } catch {
            setStatus({ kind: 'error', message: 'Could not save this post. It may have changed elsewhere.' });
        }
    }

    async function deletePostById(id: number, name: string) {
        if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;

        setStatus({ kind: 'loading' });
        try {
            await deletePost(id);
            setPosts((current) => current.filter((post) => post.id !== id));
            if (id === selectedId) startNewPost();
            setStatus({ kind: 'success', message: 'Post deleted.' });
        } catch {
            setStatus({ kind: 'error', message: 'Could not delete this post.' });
        }
    }

    const sortedPosts = [...posts].sort((a, b) => b.created - a.created);

    return (
        <div className={styles.page}>
            <div id="posts_list_sidebar" className={styles.sidebar}>
                <button type="button" className={styles.newButton} onClick={startNewPost}>
                    + New post
                </button>
                <div className={styles.postsList}>
                    {sortedPosts.map((post) => (
                        <div
                            key={post.id}
                            className={post.id === selectedId ? styles.postsListItemActive : styles.postsListItem}
                            role="button"
                            tabIndex={0}
                            onClick={() => selectPost(post.id)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') selectPost(post.id);
                            }}
                        >
                            <span>{post.name}</span>
                            <button
                                type="button"
                                className={styles.deleteButton}
                                aria-label={`Delete ${post.name}`}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    deletePostById(post.id, post.name);
                                }}
                            >
                                {'␡'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <form id="post_editor" className={styles.editor} onSubmit={saveDraft}>
                <div className={styles.actionBar}>
                    {status.kind === 'error' && <span className={styles.statusError}>{status.message}</span>}
                    {status.kind === 'success' && <span className={styles.statusSuccess}>{status.message}</span>}
                    <button type="submit" className={styles.saveButton} disabled={status.kind === 'loading'}>
                        save
                    </button>
                </div>

                <label>
                    name
                    <input
                        type="text"
                        value={draft.name}
                        onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                        required
                    />
                </label>

                <label>
                    description
                    <textarea
                        value={draft.description}
                        onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                        rows={2}
                    />
                </label>

                <label>
                    date
                    <input
                        type="date"
                        value={draft.updated}
                        onChange={(event) => setDraft({ ...draft, updated: event.target.value })}
                        required
                    />
                </label>

                <label>
                    tags
                    <input
                        type="text"
                        value={draft.tags}
                        onChange={(event) => setDraft({ ...draft, tags: event.target.value })}
                        placeholder="comma, separated, tags"
                    />
                </label>

                <label>
                    content
                    <MarkdownEditorField
                        key={selectedId ?? 'new'}
                        id="post_body"
                        defaultValue={draft.body}
                        onChange={handleBodyChange}
                    />
                </label>
            </form>
        </div>
    );
}

function toDateInputValue(timestamp: number | null): string {
    return new Date(timestamp ?? Date.now()).toISOString().slice(0, 10);
}

function toSummary(post: PostDetail): PostSummary {
    return {
        name: post.name,
        id: post.id,
        created: post.created,
        updated: post.updated,
        description: post.description,
    };
}

function upsertPost(posts: PostSummary[], post: PostSummary): PostSummary[] {
    return [...posts.filter((existing) => existing.id !== post.id), post];
}

function toDraft(post: PostDetail): Draft {
    return {
        name: post.name,
        description: post.description,
        tags: post.tags.join(', '),
        body: post.body,
        updated: toDateInputValue(post.updated),
    };
}

function fromDraft(draft: Draft) {
    return {
        name: draft.name,
        description: draft.description,
        tags: draft.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        body: draft.body,
        updated: draft.updated,
    };
}

async function fetchPosts(): Promise<PostSummary[]> {
    const response = await fetch('/api/posts');
    const data = await response.json();
    if (!data.success) throw new Error('Failed to load posts');
    return data.posts;
}

async function fetchPost(id: number): Promise<PostDetail> {
    const response = await fetch(`/api/post?id=${id}`);
    const data = await response.json();
    if (!data.success || !data.post) throw new Error('Failed to load post');
    return data.post;
}

async function createPost(payload: ReturnType<typeof fromDraft>): Promise<PostDetail> {
    const response = await fetch('/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!data.success || !data.post) throw new Error('Failed to create post');
    return data.post;
}

async function updatePost(id: number, payload: ReturnType<typeof fromDraft>): Promise<PostDetail> {
    const response = await fetch(`/api/post?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!data.success || !data.post) throw new Error('Failed to update post');
    return data.post;
}

async function deletePost(id: number): Promise<void> {
    const response = await fetch(`/api/post?id=${id}`, { method: 'DELETE' });
    const data = await response.json();
    if (!data.success) throw new Error('Failed to delete post');
}
