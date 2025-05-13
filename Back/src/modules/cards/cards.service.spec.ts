import { Test, TestingModule } from '@nestjs/testing';
import { CardsService } from './cards.service';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { RealtimeGateway } from '../realtime/realtime.gateway';

const mockFind = jest.fn().mockReturnValue({
  sort: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([]),
});
const mockCardModel = {
  find: mockFind,
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  findByIdAndRemove: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  updateMany: jest.fn(),
  db: { startSession: jest.fn().mockResolvedValue({
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    abortTransaction: jest.fn(),
    endSession: jest.fn(),
  }) },
};

const mockRealtimeGateway = {
  emitCardAdded: jest.fn(),
  emitCardUpdated: jest.fn(),
  emitCardDeleted: jest.fn(),
  emitCardMoved: jest.fn(),
};

describe('CardsService', () => {
  let service: CardsService;
  let cardModel: typeof mockCardModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardsService,
        {
          provide: getModelToken('Card'),
          useValue: mockCardModel,
        },
        {
          provide: RealtimeGateway,
          useValue: mockRealtimeGateway,
        },
      ],
    }).compile();

    service = module.get<CardsService>(CardsService);
    cardModel = module.get(getModelToken('Card'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('no debería crear tarjeta con título vacío', async () => {
    const data = { title: '', columnId: 'col1', position: 0 };
    await expect(service.create(data as any)).rejects.toThrow();
  });

  it('debería lanzar error al eliminar tarjeta inexistente', async () => {
    cardModel.findById.mockResolvedValue(null);
    await expect(service.remove('id-inexistente')).rejects.toThrow();
  });
}); 