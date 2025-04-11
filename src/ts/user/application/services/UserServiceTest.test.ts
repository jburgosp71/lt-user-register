import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './UserService';
import { UserRepositoryPort } from '../ports/out/UserRepositoryPort';
import { MailSenderPort } from '../ports/out/MailSenderPort';
import { UserRegisterDto } from '../../interface/rest/dto/UserRegisterDto';
import { UserRegisterResponseDto } from '../../interface/rest/dto/UserRegisterResponseDto';
import { DbException } from '../exceptions/DbException';
import { MailException } from '../exceptions/MailException';
import { USER_REPOSITORY, MAIL_SENDER } from '../constants/tokens';

describe('UserService', () => {
    let service: UserService;
    let mockUserRepo: Partial<UserRepositoryPort>;
    let mockMailSender: Partial<MailSenderPort>;

    beforeEach(async () => {
        mockUserRepo = {
            findByEmail: jest.fn(),
            createUser: jest.fn(),
        };

        mockMailSender = {
            sendWelcomeEmail: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: USER_REPOSITORY,
                    useValue: mockUserRepo,
                },
                {
                    provide: MAIL_SENDER,
                    useValue: mockMailSender,
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('registerUser', () => {
        it('should return a success message when user is successfully registered', async () => {
            // Arrange
            const dto: UserRegisterDto = {
                EMAIL: 'test@example.com',
                NAME: 'Test User',
            };

            const userMock = {
                id: 1,
                name: 'Test User',
                email: 'test@example.com',
                createdAt: new Date(),
            };

            mockUserRepo.findByEmail = jest.fn().mockResolvedValue(null); // No existe el usuario
            mockUserRepo.createUser = jest.fn().mockResolvedValue(userMock);
            mockMailSender.sendWelcomeEmail = jest.fn().mockResolvedValue(undefined); // Mail enviado con éxito

            // Act
            const result: UserRegisterResponseDto = await service.registerUser(dto);

            // Assert
            expect(result.message).toBe('User registered successfully');
            expect(result.id).toBe(userMock.id);
            expect(result.createdAt).toBe(userMock.createdAt);
            expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(dto.EMAIL);
            expect(mockUserRepo.createUser).toHaveBeenCalledWith(dto.NAME, dto.EMAIL);
            expect(mockMailSender.sendWelcomeEmail).toHaveBeenCalledWith(userMock.email, userMock.name);
        });

        it('should return a message when user already exists', async () => {
            // Arrange
            const dto: UserRegisterDto = {
                EMAIL: 'test@example.com',
                NAME: 'Test User',
            };

            const existingUser = {
                id: 1,
                name: 'Test User',
                email: 'test@example.com',
                createdAt: new Date(),
            };

            mockUserRepo.findByEmail = jest.fn().mockResolvedValue(existingUser); // Usuario ya existe

            // Act
            const result: UserRegisterResponseDto = await service.registerUser(dto);

            // Assert
            expect(result.message).toBe('User already exists');
            expect(result.id).toBe(existingUser.id);
            expect(result.createdAt).toBe(existingUser.createdAt);
            expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(dto.EMAIL);
            expect(mockUserRepo.createUser).not.toHaveBeenCalled();
        });

        it('should throw DbException when database operation fails', async () => {
            // Arrange
            const dto: UserRegisterDto = {
                EMAIL: 'test@example.com',
                NAME: 'Test User',
            };

            mockUserRepo.findByEmail = jest.fn().mockRejectedValue(new Error('Database error'));

            // Act & Assert
            await expect(service.registerUser(dto)).rejects.toThrow(DbException);
        });

        it('should throw MailException when email sending fails', async () => {
            // Arrange
            const dto: UserRegisterDto = {
                EMAIL: 'test@example.com',
                NAME: 'Test User',
            };

            const userMock = {
                id: 1,
                name: 'Test User',
                email: 'test@example.com',
                createdAt: new Date(),
            };

            mockUserRepo.findByEmail = jest.fn().mockResolvedValue(null); // No existe el usuario
            mockUserRepo.createUser = jest.fn().mockResolvedValue(userMock);
            mockMailSender.sendWelcomeEmail = jest.fn().mockRejectedValue(new Error('Mail error'));

            // Act & Assert
            await expect(service.registerUser(dto)).rejects.toThrow(MailException);
        });
    });
});
