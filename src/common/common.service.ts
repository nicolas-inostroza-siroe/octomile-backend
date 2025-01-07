import { BadRequestException, ConflictException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';

@Injectable()
export class CommonService {
    private logger = new Logger();

    public handleExceptions(error: any) {
        console.log(error);
        this.logger.error(error);
        if (error.code === "23505")
            throw new BadRequestException(error.detail);

        if (error.status === HttpStatus.NOT_FOUND)
            throw new NotFoundException(error.response);

        if (error.status = HttpStatus.CONFLICT)
            throw new ConflictException(error.response);


        throw new InternalServerErrorException("Unexpected error , check server logs");
    }


}
