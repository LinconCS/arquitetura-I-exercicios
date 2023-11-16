import { VideoDatabase } from "../database/VideoDatabase"
import { Video } from "../models/Video"
import { TVideoDB } from "../types"

export class VideoBusiness {

    public getVideos = async (input: any) => {
        const { q } = input

        const videoDatabase = new VideoDatabase()
        const videosDB = await videoDatabase.findVideos(q)

        const videos: Video[] = videosDB.map((videoDB) => new Video(
            videoDB.id,
            videoDB.title,
            videoDB.duration,
            videoDB.upload_date
        ))

        return videos
    }

    public createVideo = async (input: any) => {
        const { id, title, duration } = input

        if (typeof id !== "string") {
            // res.status(400)
            throw new Error("'id' deve ser string")
        }

        if (typeof title !== "string") {
            // res.status(400)
            throw new Error("'title' deve ser string")
        }

        if (typeof duration !== "number") {
            // res.status(400)
            throw new Error("'duration' deve ser number")
        }

        const videoDatabase = new VideoDatabase()
        const videoDBExists = await videoDatabase.findVideoById(id)

        if (videoDBExists) {
            // res.status(400)
            throw new Error("'id' já existe")
        }

        const newVideo = new Video(
            id,
            title,
            duration,
            new Date().toISOString()
        )

        const newVideoDB: TVideoDB = {
            id: newVideo.getId(),
            title: newVideo.getTitle(),
            duration: newVideo.getDuration(),
            upload_date: newVideo.getUploadDate()
        }

        await videoDatabase.insertVideo(newVideoDB)

        return newVideo
    }

    public updateVideo = async (input: any) => {
        const { id, newId, newTitle, newDuration } = input;

        const videoDatabase = new VideoDatabase();
        const videoDB = await videoDatabase.findVideoById(id);

        if (!videoDB) {
            throw new Error("'id' não existe");
        }

        const video = new Video(
            videoDB.id,
            videoDB.title,
            videoDB.duration,
            videoDB.upload_date
        );

        if (newId !== undefined) {
            if (typeof newId !== "string") {
                throw new Error("'newId' deve ser string");
            }
        }

        if (newTitle !== undefined) {
            if (typeof newTitle !== "string") {
                throw new Error("'newTitle' deve ser string");
            }
        }

        if (newDuration !== undefined) {
            if (typeof newDuration !== "number") {
                throw new Error("'newDuration' deve ser number");
            }
        }

        newId && video.setId(newId);
        newTitle && video.setTitle(newTitle);
        newDuration && video.setDuration(newDuration);

        const newVideo: TVideoDB = {
            id: video.getId(),
            title: video.getTitle(),
            duration: video.getDuration(),
            upload_date: video.getUploadDate(),
        };

        await videoDatabase.updateVideo(id, newId, newTitle, newDuration);

        return { message: "Video atualizado com sucesso", newVideo };
    };

    public deleteVideo = async (input: any) => {
        const { id } = input;

        const videoDatabase = new VideoDatabase();
        const videoDB = await videoDatabase.findVideoById(id);

        if (!videoDB) {
            throw new Error("'id' não existe");
        }

        await videoDatabase.deleteVideo(id);

        return { message: "Video deletado com sucesso" };
    };
}
