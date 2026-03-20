import { Controller, Get } from '@nestjs/common';

@Controller('categorias')
export class CategoriasController {

    @Get()
    getCategorias(){
        return "estas son las categorias";
    }
}
