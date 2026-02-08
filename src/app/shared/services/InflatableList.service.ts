import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, tap, map } from 'rxjs';

export interface PaginatedResponse<G> { data: G[]; links: any; meta: any; }

export abstract class InflatableListService<G, P> {

    protected abstract baseUrl: string;
    protected readonly http = inject(HttpClient);
    protected fromJson(item: any): G { return item as G; }
    protected toJson(item: any): P { return item as P; }

    getList(
        next?: (data: G[]) => void,
        error?: (err: any) => void
    ): Observable<G[]> {
        return this.http.get<PaginatedResponse<G>>(`${this.baseUrl}`).pipe(
            map(resp => resp.data.map((item: any) => this.fromJson(item))), tap({ next: data => next?.(data), error: err => error?.(err) })
        );
    }

    getDetails(
        id: number,
        next?: (data: G) => void,
        error?: (err: any) => void
    ): Observable<G> {
        return this.http.get<G>(`${this.baseUrl}/${id}`).pipe(
            tap({
                next: data => next?.(data),
                error: err => error?.(err)
            })
        );
    }

    create(
        payload: Partial<P>,
        next?: (data: P) => void,
        error?: (err: any) => void
    ): Observable<P> {
        return this.http.post<P>(`${this.baseUrl}`, payload).pipe(
            tap({
                next: data => next?.(data),
                error: err => error?.(err)
            })
        );
    }

    update(
        id: number,
        payload: Partial<P>,
        next?: (data: P) => void,
        error?: (err: any) => void
    ): Observable<P> {
        return this.http.patch<P>(`${this.baseUrl}/${id}`, payload).pipe(
            tap({
                next: data => next?.(data),
                error: err => error?.(err)
            })
        );
    }

    delete(
        id: number,
        next?: (data: G) => void,
        error?: (err: any) => void,
        idToReplace?: number
    ): Observable<G> {
        return this.http.delete<G>(`${this.baseUrl}/${id}` + (idToReplace ? '/' + idToReplace : '')).pipe(
            tap({
                next: data => next?.(data),
                error: err => error?.(err)
            })
        );
    }
}
