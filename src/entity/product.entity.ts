import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    UpdateDateColumn,
    CreateDateColumn,
} from "typeorm";

@Entity({ name: "products" })
export default class Product {
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

    @Column({ nullable: true })
    size: string;

    @Column({ nullable: true })
    price: number;

    @Column({ nullable: true })
    category: string;

    @UpdateDateColumn()
    updatedAt: number;

    @CreateDateColumn()
    createdAt: number;
}
