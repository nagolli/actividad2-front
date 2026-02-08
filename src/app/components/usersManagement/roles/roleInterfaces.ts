
export class Role {

    public name: string = ""
    public id: number = 0;
    public permissions: { description: string, level: number }[] = []

    description(separator: string = "\n") {
        return this.permissions.filter(p => p.level > 0).map(p => p.description + " - " + this.levelToStr(p.level)).join(separator)
    }

    private levelToStr(level: number) {
        switch (level) {
            case 1: return "Lectura";
            case 2: return "Edición";
            case 3: return "Avanzado";
            default: return "Prohibido";
        }
    }
}

export class PostRole {

    public name: string = ""
    public id: number = 0;
    public permissions: { permissionId: number, permissionLevel: number }[] = []
}


