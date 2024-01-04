import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    UpdateDateColumn,
    CreateDateColumn,
} from "typeorm";

@Entity({ name: "categories" })
export default class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @UpdateDateColumn()
    updatedAt: number;

    @CreateDateColumn()
    createdAt: number;
}
