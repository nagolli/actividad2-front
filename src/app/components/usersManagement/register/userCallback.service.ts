import { Injectable } from "@angular/core";
import { PostAddressData, PostRoleData, PostUserData } from "./userInterfaces";

@Injectable({ providedIn: 'root' })
export class UserCallbackService {
    private _onSuccess?: (user: PostUserData, address: PostAddressData, roles?: PostRoleData) => void;
    private _onCancel?: () => void;

    set onSuccess(fn: (user: PostUserData, address: PostAddressData, roles?: PostRoleData) => void) {
        this._onSuccess = (user: PostUserData, address: PostAddressData, roles?: PostRoleData) => {
            try {
                fn(user, address, roles);
            } catch (ex) {
                console.log(ex)
            } finally {
                this.clear();
            }
        };
    }

    get onSuccess(): ((user: PostUserData, address: PostAddressData, roles?: PostRoleData) => void) | undefined {
        return this._onSuccess;
    }

    set onCancel(fn: () => void) {
        this._onCancel = () => {
            try {
                fn();
            } catch (ex) {
                console.log(ex)
            } finally {
                this.clear();
            }
        };
    }

    get onCancel(): (() => void) | undefined {
        return this._onCancel;
    }

    clear() {
        this._onSuccess = undefined;
        this._onCancel = undefined;
    }
}
