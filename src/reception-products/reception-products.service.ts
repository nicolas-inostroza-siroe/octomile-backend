import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReceptionProductDto } from './dto/create-reception-product.dto';
import { UpdateReceptionProductDto } from './dto/update-reception-product.dto';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { ReceptionProduct } from './entities/reception-product.entity';
import { webSocketGateway } from '../web-socket/web-socket.gateway';

@Injectable()
export class ReceptionProductsService {

  constructor(
      @InjectRepository(ReceptionProduct)
      private readonly receptionProductEntity: Repository<ReceptionProduct>,
      @InjectEntityManager()
      private readonly entityManager: EntityManager,
      private readonly webSocketGateway: webSocketGateway,
  ){}
  async create(createReceptionProductDto: CreateReceptionProductDto[]) {


    const nowDate = this.nowDate()

    const insertQuery = `
      INSERT INTO receptionProduct (
        guia, codigo, codigoDos, referenceId,conductor,vehiculo,titulo,direccion,eta,personaResponsable,tiempoEstimado,tiempoReal,avance,retraso,latitud,longitud,checkoutLatitud,checkoutlongitud,nota,nombreContacto,telefonoContacto,correoContacto,rutaId,origenId,documento,fotografiaFachada,pais,comercio,observacion empresa, conductor, patente, 
        fechaCreacion, fechaSalida, fechaGestion,  origen, 
        motivo, estado, lugarFisico, fechaIngreso
      ) 
      VALUES 
      ${createReceptionProductDto.map(() => `(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).join(", ")}
    `;

    const values = createReceptionProductDto.flatMap(dto => [
      dto.trackingID,
      dto.codigo,
      dto.codigoDos,
      dto.empresa,
      dto.conductor,
      dto.patente,
      dto.fechaCreacion,
      dto.fechaSalida,
      dto.fechaGestion,
      dto.origen,
      dto.motivo,
      dto.estado,
      dto.lugarFisico,
      nowDate
    ]);
 
    await this.entityManager.query(insertQuery, values);

    return {
        status: HttpStatus.OK,
        message: 'Records inserted successfully',
    };
  }

  async createSingle(createSingleProductDto: any) {
    const nowDate = this.nowDate();

    // Format date fields to 'YYYY-MM-DD' format
    const formatDate = (dateString) => {
      if (!dateString) return null;
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    };

    const insertQuery = `
      INSERT INTO receptionProduct (
        guia, codigo, codigoDos, empresa, conductor, patente, 
        fechaCreacion, fechaSalida, fechaGestion, origen, diasAtraso,
        motivo, destino, lugarFisico, estadoPorGestor, estado, fechaIngreso
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      createSingleProductDto.guia,
      createSingleProductDto.codigo,
      createSingleProductDto.codigoDos,
      createSingleProductDto.empresa,
      createSingleProductDto.conductor,
      createSingleProductDto.patente,
      formatDate(createSingleProductDto.fechaCreacion),
      formatDate(createSingleProductDto.fechaSalida),
      formatDate(createSingleProductDto.fechaGestion),
      createSingleProductDto.origen,
      createSingleProductDto.diasAtraso || 0, // Use diasAtraso from frontend or default to 0
      createSingleProductDto.motivo,
      createSingleProductDto.destino,
      createSingleProductDto.lugarFisico,
      createSingleProductDto.estadoPorGestor,
      createSingleProductDto.estado || 'Pendiente', // Added estado field with default value
      nowDate
    ];
 
    await this.entityManager.query(insertQuery, values);

    return {
      status: HttpStatus.OK,
      message: 'Reception product created successfully',
    };
  }

  async findAll(page: number, size: number, searchQuery: string, selectedDate: string, selectTypeBy: string, selectTypeDate: string) {

    console.log("searchQuery: ", searchQuery, "selectedDate: ",  selectedDate, "selectTypeDate: ",  selectTypeDate, "selectTypeBy: ",  selectTypeBy);

    let query = `
      SELECT r.fechaIngreso, r.fechaGestion, r.fechaEscaneo, r.origen, r.guia, r.conductor, r.estado, u.fullName name
      FROM receptionProduct r
      LEFT JOIN user_octomile u ON u.id = r.escaneadorId
      WHERE 1=1
    `;
    
    const parameters: any[] = [];
    
    if (searchQuery) {
      query += ` AND ${selectTypeBy} LIKE ?`;
      parameters.push(`%${searchQuery}%`);
    }
  
    if (selectedDate) {
      let formattedDate = null;
      const date = new Date(selectedDate);
      formattedDate = date.toISOString().slice(0, 19).replace("T", " ").split(" ");

      query += ` AND ${selectTypeDate} = ?`;
      parameters.push(formattedDate[0]);
    }
  
    query += ` ORDER BY r.id DESC LIMIT ? OFFSET ?`;
  
    parameters.push(size);
    parameters.push(page * size);
  
    const products = await this.entityManager.query(query, parameters);
  
    let countQuery = `
      SELECT COUNT(*) as count
      FROM receptionProduct
      WHERE 1=1
    `;
  
    if (searchQuery) {
      countQuery += ` AND ${selectTypeBy} LIKE ?`;
    }
  
    if (selectedDate) {      
      countQuery += ` AND ${selectTypeDate} = ?`;
    }
  
    const resultCount = await this.entityManager.query(countQuery, parameters);
    const total = resultCount[0]?.['count'] || 0;
  
    return {
      status: HttpStatus.OK,
      message: 'Records fetched successfully',
      data: {
        products,
        total,
        page,
        size,
      },
    };
  }

  async findDestination(page: number, size: number, searchQuery: string, selectedDate: string, selectTypeBy: string, selectTypeDate: string) {

    const allowed = ['empresa', 'guia', 'fechaCreacion', 'fechaSalida', 'fechaGestion', 'fechaIngreso', ''];
    if (!allowed.includes(selectTypeBy) || !allowed.includes(selectTypeDate)) {
      throw new Error('Invalid columns');
    }

    let query = `
      SELECT r.id, r.fechaIngreso, r.fechaGestion, r.fechaEscaneo, r.origen, r.guia, r.conductor, r.estado, u.fullName name, r.fechaDestino, r.destino, u2.fullName gestorDestino
      FROM receptionProduct r
      LEFT JOIN user_octomile u ON u.id = r.escaneadorId
      LEFT JOIN user_octomile u2 ON u2.id = r.gestorDestinoId
      WHERE estado <> 'Por Recepcionar'
    `;
    
    const parameters: any[] = [];
    
    if (searchQuery) {
      query += ` AND ${selectTypeBy} LIKE ?`;
      parameters.push(`%${searchQuery}%`);
    }
  
    if (selectedDate) {
      let formattedDate = null;
      const date = new Date(selectedDate);
      formattedDate = date.toISOString().slice(0, 19).replace("T", " ").split(" ");

      query += ` AND ${selectTypeDate} = ?`;
      parameters.push(formattedDate[0]);
    }
  
    query += ` ORDER BY r.fechaEscaneo DESC LIMIT ? OFFSET ?`;
  
    parameters.push(size);
    parameters.push(page * size);
  
    const products = await this.entityManager.query(query, parameters);
  
    let countQuery = `
      SELECT COUNT(*) as count
      FROM receptionProduct
      WHERE estado <> 'Por Recepcionar'
    `;
  
    const countParams: any[] = [];
    if (searchQuery) {
      countQuery += ` AND r.${selectTypeBy} LIKE ?`;
      countParams.push(`%${searchQuery}%`);
    }
    if (selectedDate) {
      let formattedDate = null;
      const date = new Date(selectedDate);
      formattedDate = date.toISOString().slice(0, 19).replace("T", " ").split(" ");

      query += ` AND ${selectTypeDate} = ?`;
      countParams.push(formattedDate);
    }
  
    const resultCount = await this.entityManager.query(countQuery, countParams);
    const total = resultCount[0]?.['count'] || 0;
  
    return {
      status: HttpStatus.OK,
      message: 'Records fetched successfully',
      data: {
        products,
        total,
        page,
        size,
      },
    };
  }



  async scan(codigoProducto: string, pinchadoPorId: string, pinchadoPorName: string, fecha: Date){

    const query = `
    SELECT id, estado, conductor, motivo FROM receptionProduct WHERE guia = ? 
    `;

    const res = await this.entityManager.query(query, [codigoProducto]);

    if(res.length === 0){
      return {
        message: 'Product not exist',
        status: HttpStatus.CONFLICT
      }
    }
    if(res[0].estado != 'Por Recepcionar'){
      return {
        message: 'Product already scanned',
        status: HttpStatus.CONFLICT
      }
    }

    const query2 = `
      UPDATE receptionProduct SET estado = 'Recepcionado', fechaEscaneo = ?,escaneadorId = ? WHERE id = ? 
    `

    const update = await this.entityManager.query(query2, [this.nowDate(), pinchadoPorId, res[0].id]);

    if(!update.affectedRows && !update.rowCount) {
      return {
        message: 'Failed to update product',
        status: HttpStatus.INTERNAL_SERVER_ERROR
      };
    }

    const countQuery = `
      SELECT COUNT(*) as faltante
      FROM receptionProduct
      WHERE conductor = ? AND estado = 'Por Recepcionar'
    `

    const faltantes = await this.entityManager.query(countQuery, [res[0].conductor]);


    const result = {
      ...res[0],
      pinchadoPor: pinchadoPorName,
      estadoFinal: 'Recepcionado',
      faltantes: faltantes[0].faltante
    }

    this.webSocketGateway.emitReceptionProduct(1, result);

    return {
      message: 'Product scanned',
      status: HttpStatus.OK,
      data: result
    }
  }

  async scanDIS(codigoProducto: string, pinchadoPorId: string, pinchadoPorName: string, origen: string){

    const date = this.nowDate();
    const query = `
    INSERT INTO receptionProduct (guia, estado, fechaIngreso, fechaEscaneo, escaneadorId, origen)
    VALUES (?,'Recepcionado manualmente', ?, ?, ?, ?)
    `
    const res = await this.entityManager.query(query, [codigoProducto, date, date, pinchadoPorId, origen])

    if(!res.affectedRows || res.affectedRows === 0) {
      throw new NotFoundException(`Error inserting ${codigoProducto} into receptionProduct`);
    }

    const data = {
      guia: codigoProducto,
      pinchadoPor: pinchadoPorName,
      estadoFinal: 'Recepcionado manualmente',
      conductor: '---',
      motivo: '---',
      faltantes: '---'
    }

    this.webSocketGateway.emitReceptionProduct(1, data);

    return {
      message: 'product manually scaned succesfully',
      status: HttpStatus.OK,
      data: data
    }
  }

  async newDestination(id: string, newDestination: string, userId: string){
    const query = `
      UPDATE receptionProduct SET destino = ?, gestorDestinoId = ?, fechaDestino = ? WHERE id = ?
    `

    const result = await this.entityManager.query(query, [newDestination, userId, this.nowDate(), id])

    if(!result.affectedRows && !result.rowCount){
      return {
        message: 'Failed to update product',
        status: HttpStatus.INTERNAL_SERVER_ERROR
      }
    }

    return {
      message: 'Destination Update succesfully',
      status: HttpStatus.OK
    }
  }

  nowDate(){
    const now = new Date();
    const fechaFormateada = new Date().toLocaleString('es-CL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).replace(',', '');

    const milisegundos = String(now.getMilliseconds()).padStart(3, '0');

    const [dia, mes, año, hora, minutos, segundos] = fechaFormateada.match(/\d+/g);
    const formattedDate = `${año}-${mes}-${dia} ${hora}:${minutos}:${segundos}.${milisegundos}`;

    return formattedDate
  }

  
}