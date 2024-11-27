import { BadRequestException, Injectable } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { ServiceOrdersSenhaffer } from './interfaces';
import { catchError } from 'rxjs';

@Injectable()
export class SenhafferApiService {

  private senhafferUrl: string = 'https://qaapi.bluex.cl/crsbrd/crdop/serhafen-checkpoints/v1';

  constructor(private httpService: HttpService) { }


  loadOrders(body: ServiceOrdersSenhaffer) {

    const url = `${this.senhafferUrl}/service-orders-released`;

    return this.httpService.post(url, body)
      .pipe(
        catchError((error) => {
          throw new BadRequestException(error)
        })
      )


  }



}
