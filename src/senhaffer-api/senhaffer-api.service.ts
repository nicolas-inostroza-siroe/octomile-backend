import { BadRequestException, Injectable } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { ServiceOrdersSenhaffer } from './interfaces';
import { catchError, of } from 'rxjs';
import { ConfirmShiptmentDto } from '../sorting/dto';

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

  confirmShipmentsBySenhaffer(body: ConfirmShiptmentDto) {

    const url = `${this.senhafferUrl}/confirm-orders`;

    // return this.httpService.post(url, body)
    //   .pipe(
    //     catchError((error) => {
    //       throw new BadRequestException(error);
    //     })
    //   );


    const { hawbs, mawb } = body;

    const dataTest = {
      mawb,
      hawbs
    }
    return of(dataTest);
  }


  uploadStatusLoadByShenhaffer(hawbs: string[], status: string) {
    return of(hawbs);
  }



}
