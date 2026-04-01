export type PaginationParams = {
    page: number;
    limit: number;
    skip: number;
};

export type PaginationMeta = {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
};

const toPositiveInt = (value: unknown, fallback: number) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return fallback;
    const i = Math.floor(n);
    return i > 0 ? i : fallback;
};

export const getPaginationParams = (
    query: Record<string, unknown>,
    defaults?: { page?: number; limit?: number; maxLimit?: number },
): PaginationParams => {
    const page = toPositiveInt(query.page, defaults?.page ?? 1);
    const maxLimit = defaults?.maxLimit ?? 50;
    const limit = Math.min(
        toPositiveInt(query.limit, defaults?.limit ?? 10),
        maxLimit,
    );
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};

export const getPaginationMeta = (
    page: number,
    limit: number,
    totalItems: number,
): PaginationMeta => {
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    return {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
    };
};

