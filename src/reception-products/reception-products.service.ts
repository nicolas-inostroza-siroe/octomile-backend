import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateReceptionProductDto } from './dto/create-reception-product.dto';
import { UpdateReceptionProductDto } from './dto/update-reception-product.dto';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { ReceptionProduct } from './entities/reception-product.entity';

@Injectable()
export class ReceptionProductsService {

  constructor(
      @InjectRepository(ReceptionProduct)
      private readonly receptionProductEntity: Repository<ReceptionProduct>,
      @InjectEntityManager()
      private readonly entityManager: EntityManager
  ){}
  async create(createReceptionProductDto: CreateReceptionProductDto[]) {


    const nowDate = this.nowDate()

    const insertQuery = `
      INSERT INTO receptionProduct (
        guia, codigo, codigoDos, empresa, conductor, patente, 
        fechaCreacion, fechaSalida, fechaGestion, diasAtraso, origen, 
        motivo, estado, lugarFisico, fechaIngreso
      ) 
      VALUES 
      ${createReceptionProductDto.map(() => `(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).join(", ")}
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
      dto.diasAtraso,
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
      SELECT * 
      FROM receptionProduct
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
  
    query += ` ORDER BY id ASC LIMIT ? OFFSET ?`;
  
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

  findOne(id: number) {
    return `This action returns a #${id} receptionProduct`;
  }

  update(id: number, updateReceptionProductDto: UpdateReceptionProductDto) {
    return `This action updates a #${id} receptionProduct`;
  }

  remove(id: number) {
    return `This action removes a #${id} receptionProduct`;
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
