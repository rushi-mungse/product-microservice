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
    price: number;

    @Column()
    currency: string;

    @Column("text")
    imageUrl: string;

    @Column()
    availability: boolean;

    @Column()
    preparationTimeInMinute: number;

    @Column()
    disscount: number;

    @Column("text", { array: true })
    ingredients: string[];

    @UpdateDateColumn()
    updatedAt: number;

    @CreateDateColumn()
    createdAt: number;
}

// size SizeEntity
// category string fk
// ingredients string[]
