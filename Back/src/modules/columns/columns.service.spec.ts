import { Test, TestingModule } from '@nestjs/testing';
import { ColumnsService } from './columns.service';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { RealtimeGateway } from '../realtime/realtime.gateway';

// Mock para simular el modelo de Mongoose como objeto
const mockColumnModel = {
  find: jest.fn().mockReturnValue({ populate: jest.fn().mockResolvedValue([]) }),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
  create: jest.fn(),
  // Simula el constructor new this.columnModel(data)
  mockConstructor: (data: any) => ({
    ...data,
    save: jest.fn().mockResolvedValue(data),
  }),
};

const mockRealtimeGateway = {
  emitColumnAdded: jest.fn(),
  emitColumnUpdated: jest.fn(),
  emitColumnDeleted: jest.fn(),
};

describe('ColumnsService', () => {
  let service: ColumnsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ColumnsService,
        {
          provide: getModelToken('Column'),
          useValue: mockColumnModel,
        },
        {
          provide: RealtimeGateway,
          useValue: mockRealtimeGateway,
        },
      ],
    }).compile();

    service = module.get<ColumnsService>(ColumnsService);

    // Sobrescribe el constructor en la instancia del servicio
    (service as any).columnModel = function (data: any) {
      return mockColumnModel.mockConstructor(data);
    };
    // Copia los métodos estáticos
    Object.assign((service as any).columnModel, mockColumnModel);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('debería crear una columna válida', async () => {
    const data = { title: 'Columna 1', position: 0 };
    const result = await service.create(data as any);
    expect(result.title).toBe('Columna 1');
  });

  

  it('debería lanzar error al eliminar columna inexistente', async () => {
    mockColumnModel.findByIdAndDelete.mockReturnValueOnce({ exec: jest.fn().mockResolvedValue(null) });
    await expect(service.delete('id-inexistente')).rejects.toThrow(NotFoundException);
  });
});
