
//De aqui se puede importar mucho de userInterfaces.ts

import { PostAddressData } from "../register/userInterfaces";

export class Employee {
    public id: number = 0;
    public email: string = "";
    public name: string = "";
    public surname: string = "";
    public roles: { description: string, id: number }[] = [];
    public enabled: boolean = false;

    description(separator: string = "\n") {
        return [this.email].concat(this.roles.map(p => p.description)).join(separator)
    }

    title() {
        return this.surname + ", " + this.name
    }

}

export class PostEmployee {
    public id: number = 0;
    public email: string = "";
    public name: string = "";
    public surname: string = "";
    public phone: string = "";
    public password: string = "";
    public isInactive: boolean = false;
    public addresses: PostAddressData[] = [];
    public roles: { id: number }[] = []

}


