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
    const nowDate = this.nowDate();
  
    try {
      await this.entityManager.transaction(async manager => {
  
        const trackingIds = createReceptionProductDto.map(dto => dto.trackingID);
        const existingRecords = await manager.query(
          `SELECT id, guia FROM receptionProduct WHERE guia IN (?)`,
          [trackingIds]
        );
  
        console.log(existingRecords);

        const existingGuiaMap = new Map(existingRecords.map((row: any) => [row.guia, row.id]));
  
        const insertQuery = `
          INSERT INTO receptionProduct (
            guia, codigo, codigoDos, trackingId, referenceId, conductor, vehiculo, titulo, direccion, eta, personaResponsable, tiempoEstimado, tiempoReal,
            avance, retraso, latitud, longitud, checkoutLatitud, checkoutlongitud, nota, nombreContacto, telefonoContacto, correoContacto, rutaId, 
            origenId, documento, fotografiaFachada, pais, comercio, observacion, fechaCreacion, fechaSalida, fechaGestion, origen, 
            motivo, estado, lugarFisico, fechaIngreso, repetido
          ) VALUES 
          ${createReceptionProductDto.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(',')}
        `;
  
        const values = createReceptionProductDto.flatMap(dto => {
          const originalId = existingGuiaMap.get(dto.trackingID) || null;
  
          return [
            dto.trackingID,
            dto.trackingID,
            dto.trackingID,
            dto.trackingID,
            dto.referenceId,
            dto.driver,
            dto.vehicle,
            dto.title,
            dto.address,
            dto.eTA,
            dto.responsiblePerson,
            dto.estimatedServiceTime,
            dto.realServiceTime,
            dto.advance,
            dto.delay,
            dto.latitude,
            dto.longitude,
            dto.checkoutLatitude,
            dto.checkoutLongitude,
            dto.notes,
            dto.contactName,
            dto.contactPhone,
            dto.contactEmail,
            dto.routeID,
            dto.idOrigen,
            dto.documento,
            dto.fotografíaFachada,
            dto.country,
            dto.comercio,
            dto.comments,
            dto.plannedDate,
            dto.checkin,
            dto.checkoutFechaGestión,
            'Ultima Milla',
            dto.comments,
            'Por Recepcionar',
            dto.comments,
            nowDate,
            originalId
          ];
        });
  
        await manager.query(insertQuery, values);
  
      });
  
      return {
        status: HttpStatus.OK,
        message: 'Records inserted successfully',
      };
    } catch (error) {
      console.error('Error al insertar productos:', error);
      return {
        status: HttpStatus.CONFLICT,
        message: 'Error during insertion',
      };
    }
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

  async findAll(page: number, size: number, searchQuery: string, selectedDate: string, selectStatus: string, selectTypeDate: string) {

    console.log("searchQuery: ", searchQuery, "selectedDate: ",  selectedDate, "selectTypeDate: ",  selectTypeDate, "selectStatus: ",  selectStatus);

    let query = `
      SELECT r.id, r.fechaIngreso, r.fechaGestion, r.fechaEscaneo, r.origen, r.guia, r.conductor, r.estado, u.fullName name,
      ( SELECT COUNT(*) FROM receptionProduct r2 WHERE r2.repetido = r.id) AS cantRepetido,
      CASE 
        WHEN d.rut IS NULL THEN 0 ELSE 1 
      END AS existsDriver
      FROM receptionProduct r
      LEFT JOIN user_octomile u ON u.id = r.escaneadorId
      LEFT JOIN drivers d ON d.rut = SUBSTRING_INDEX(r.conductor, '/', -1)
      WHERE repetido IS NULL
    `;
    
    const parameters: any[] = [];
  
    if(selectStatus != ''){
      query += ` AND estado = ?`;
      parameters.push(`${selectStatus}`);
    }

    if (searchQuery) {
      query += ` AND guia LIKE ?`;
      parameters.push(`%${searchQuery}%`);
    }
  
    if (selectedDate) {
      let formattedDate = null;
      const date = new Date(selectedDate);
      formattedDate = date.toISOString().slice(0, 19).replace("T", " ").split(" ");

      query += ` AND DATE(${selectTypeDate}) = ?`;
      parameters.push(formattedDate[0]);
    }
  
    query += ` ORDER BY r.id DESC LIMIT ? OFFSET ?`;
  
    parameters.push(size);
    parameters.push(page * size);
  
    const products = await this.entityManager.query(query, parameters);
  
    let countQuery = `
      SELECT COUNT(*) as count
      FROM receptionProduct
      WHERE repetido IS NULL
    `;

    if(selectStatus != ''){
      countQuery += ` AND estado = ?`;
    }
  
    if (searchQuery) {
      countQuery += ` AND guia LIKE ?`;
    }
  
    if (selectedDate) {      
      countQuery += ` AND DATE(${selectTypeDate}) = ?`;
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

  async findDestination(page: number, size: number, searchQuery: string, selectedDate: string, selectTypeBy: string, selectTypeDate: string, selectStatus: string) {

    console.log("searchQuery: ", searchQuery, "selectedDate: ",  selectedDate, "selectTypeDate: ",  selectTypeDate, "selectStatus: ",  selectStatus, "selectTypeBy: ", selectTypeBy);

    const allowed = ['guia', 'fechaEscaneo', ''];
    if (!allowed.includes(selectTypeBy) || !allowed.includes(selectTypeDate)) {
      throw new Error('Invalid columns');
    }

    let query = `
      SELECT r.id, r.fechaIngreso, r.fechaGestion, r.fechaEscaneo, r.origen, r.guia, r.conductor, r.estado, u.fullName name, r.fechaDestino, r.destino, u2.fullName gestorDestino,
        CASE 
          WHEN d.rut IS NULL THEN 0 ELSE 1 
        END AS existsDriver
      FROM receptionProduct r
      LEFT JOIN user_octomile u ON u.id = r.escaneadorId
      LEFT JOIN user_octomile u2 ON u2.id = r.gestorDestinoId
      LEFT JOIN drivers d ON d.rut = SUBSTRING_INDEX(r.conductor, '/', -1)
      WHERE estado <> 'Por Recepcionar' AND repetido IS NULL
    `;
    
    const parameters: any[] = [];

    if(selectStatus != ''){
      query += ` AND estado = ?`;
      parameters.push(`${selectStatus}`);
    }
    
    if (searchQuery) {
      query += ` AND ${selectTypeBy} LIKE ?`;
      parameters.push(`%${searchQuery}%`);
    }
  
    if (selectedDate) {
      let formattedDate = null;
      const date = new Date(selectedDate);
      formattedDate = date.toISOString().slice(0, 19).replace("T", " ").split(" ");

      query += ` AND DATE(${selectTypeDate}) = ?`;
      parameters.push(formattedDate[0]);
    }
  
    query += ` ORDER BY r.fechaEscaneo DESC LIMIT ? OFFSET ?`;
  
    parameters.push(size);
    parameters.push(page * size);
  
    const products = await this.entityManager.query(query, parameters);
  
    let countQuery = `
      SELECT COUNT(*) as count
      FROM receptionProduct
      WHERE estado <> 'Por Recepcionar' AND repetido IS NULL
    `;
  

    if(selectStatus != ''){
      countQuery += `AND estado = ?`;
    }

    if (searchQuery) {
      countQuery += ` AND ${selectTypeBy} LIKE ?`;
    }
    if (selectedDate) {
      countQuery += ` AND DATE(${selectTypeDate}) = ?`;
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

  async scan(codigoProducto: string, pinchadoPorId: string, pinchadoPorName: string, fecha: Date){

    const query = `
    SELECT id, estado, conductor, motivo FROM receptionProduct WHERE guia = ? AND repetido IS NULL
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
      WHERE conductor = ? AND estado = 'Por Recepcionar' AND repetido IS NULL
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

  async searchDuplicate(id:string){
    const query = `
      SELECT r.id, r.fechaIngreso, r.fechaGestion, r.fechaEscaneo, r.origen, r.guia, r.conductor, r.estado, u.fullName name, r.fechaDestino, r.destino, u2.fullName gestorDestino
      FROM receptionProduct r
      LEFT JOIN user_octomile u ON u.id = r.escaneadorId
      LEFT JOIN user_octomile u2 ON u2.id = r.gestorDestinoId
      WHERE r.repetido = ?
    `

    const result = await this.entityManager.query(query, [id])
    if(!result){
      return {
        message: 'Failed to fetch duplicate',
        status: HttpStatus.INTERNAL_SERVER_ERROR
      }
    }

    return {
      message: 'Duplicate retrieved succesfully',
      status: HttpStatus.OK,
      data: result
    }
  }

  async getVoucher(init: Date, end: Date, driver: string){
    const query = `
    SELECT id, guia, fechaEscaneo, estado
    FROM receptionProduct
    WHERE conductor = ? AND fechaIngreso >= ? AND FechaIngreso <= ? AND duplicado IS NULL
    `
    const result = await this.entityManager.query(query, [driver, `${this.toSqlDate(init)} 00:00:00`, `${this.toSqlDate(end)} 23:59:59`])

    if (!result) {
      return {
        message: 'Failed to retrieve data',
        status: HttpStatus.NOT_FOUND,
      };
    }

    return {
      message: 'data vouched retrieved succesfully',
      status: HttpStatus.OK,
      data: result
    }
  }

  async checkDrivers(data: any){
    try{
      const ruts = data.map((data: any) => data.split('/')[1]);
      const uniqueRuts = [...new Set(ruts)];    
      const uniqueDriver = [...new Set(data)];
      const res = await this.entityManager.query(
        `SELECT rut FROM drivers WHERE rut in (${uniqueRuts.map(() => '?').join(',')})`, uniqueRuts
      );
      const exist = new Set(res.map((data: any) => data.rut ));    
      const noExists = uniqueDriver.filter((data: any) => !exist.has(data.split('/')[1]));
      return {
        message: 'checkDrivers succesfully',
        status: HttpStatus.OK,
        data: noExists
      }
    }catch(error){
      return{
        message: error,
        status: HttpStatus.BAD_REQUEST,
      }
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

  toSqlDate(input: string | Date): string {
    const date = new Date(input);
    return date.toISOString().split('T')[0];
  }
}