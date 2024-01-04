import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    UpdateDateColumn,
    CreateDateColumn,
} from "typeorm";

@Entity()
export default class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column("text")
    description: string;

    @Column()
    currency: string;

    @Column("text")
    imageUrl: string;

    @Column()
    availability: boolean;

    @Column()
    preparationTimeInMinute: number;

    @Column()
    discount: number;

    @Column("text")
    ingredients: string;

    @UpdateDateColumn()
    updatedAt: number;

    @CreateDateColumn()
    createdAt: number;
}

// size SizeEntity
// price
// category string fk
