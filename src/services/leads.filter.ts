import {
    LeadFilterQueryParams,
    LeadFilterResult,
    PaginationResponse
} from "../common/types";

// parse query filters and pagination
export const buildLeadQueryFilter = (query: LeadFilterQueryParams): LeadFilterResult => {
    const { search, status, page, limit } = query;
    const filterObj: Record<string, unknown> = {};
    // apply status filter
    if (status && typeof status === "string" && status.trim().toLowerCase() !== "all") {
        filterObj.status = status.trim().toLowerCase();
    }
    const searchTerm = typeof search === "string" ? search.trim() : "";
    // apply search filter
    if (searchTerm) {
        filterObj.$or = [
            { name: { $regex: searchTerm, $options: "i" } },
            { email: { $regex: searchTerm, $options: "i" } }
        ];
    }
    // parse pagination parameters
    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);
    const pageNumber = parsedPage > 0 ? parsedPage : 1;
    const limitNumber = parsedLimit > 0 ? Math.min(parsedLimit, 100) : 10;
    const skip = (pageNumber - 1) * limitNumber;
    return {
        filterObj,
        pagination: {
            pageNumber,
            limitNumber,
            skip
        }
    };
};

// format pagination response
export const formatPaginationResponse = (total: number, pageNumber: number, limitNumber: number): PaginationResponse => {
    const totalPages = Math.ceil(total / limitNumber);
    return {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1
    };
};