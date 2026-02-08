import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, tap, map } from 'rxjs';

export interface PaginatedResponse<T> { data: T[]; links: any; meta: any; }

export abstract class InflatableListService<T> {

    protected abstract baseUrl: string;
    private readonly http = inject(HttpClient);
    protected fromJson(item: any): T { return item as T; }

    getList(
        next?: (data: T[]) => void,
        error?: (err: any) => void
    ): Observable<T[]> {
        return this.http.get<PaginatedResponse<T>>(`${this.baseUrl}`).pipe(
            map(resp => resp.data.map((item: any) => this.fromJson(item))), tap({ next: data => next?.(data), error: err => error?.(err) })
        );
    }

    getDetails(
        id: number,
        next?: (data: T) => void,
        error?: (err: any) => void
    ): Observable<T> {
        return this.http.get<T>(`${this.baseUrl}/${id}`).pipe(
            tap({
                next: data => next?.(data),
                error: err => error?.(err)
            })
        );
    }

    create(
        payload: Partial<T>,
        next?: (data: T) => void,
        error?: (err: any) => void
    ): Observable<T> {
        return this.http.post<T>(`${this.baseUrl}`, payload).pipe(
            tap({
                next: data => next?.(data),
                error: err => error?.(err)
            })
        );
    }

    update(
        id: number,
        payload: Partial<T>,
        next?: (data: T) => void,
        error?: (err: any) => void
    ): Observable<T> {
        return this.http.patch<T>(`${this.baseUrl}/${id}`, payload).pipe(
            tap({
                next: data => next?.(data),
                error: err => error?.(err)
            })
        );
    }

    delete(
        id: number,
        next?: (data: T) => void,
        error?: (err: any) => void
    ): Observable<T> {
        return this.http.delete<T>(`${this.baseUrl}/${id}`).pipe(
            tap({
                next: data => next?.(data),
                error: err => error?.(err)
            })
        );
    }
}
