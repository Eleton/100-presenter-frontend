"use client";

import groq from "groq";
import { PortableText } from "@portabletext/react";
import { client } from "@/sanity/client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useNextSanityImage } from "next-sanity-image";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { Member } from "../types";

const GiftImage = ({ image }: { image: SanityImageSource }) => {
  const imageProps = useNextSanityImage(client, image);
  return <Image {...imageProps} alt="" />;
};

const queryMember = (id: string) =>
  groq`*[_type == "member" && number == ${id}]`;

const MemberViewer = ({ id }: { id: number }) => {
  const [member, setMember] = useState<Member | null>(null);

  useEffect(() => {
    client.fetch<Member[]>(queryMember(id.toString())).then((data) => {
      setMember(data[0]);
    });
  }, [id]);

  if (member === null) {
    return <></>;
  }

  const {
    name,
    joined,
    nickname,
    nicknameDescription,
    description,
    roles,
    styledDescription,
  } = member;

  return (
    <article className="flex flex-col justify-center gap-8 md:flex-row">
      <div className="w-80">
        <div className="flex max-w-[56ch] flex-col gap-2">
          <h1 className="text-xl font-bold">
            Nr {id}, {nickname}
          </h1>
          <div>
            <div className="font-bold">{name}</div>
            <div className="italic">Medlem sedan {joined.toString()}</div>
          </div>
          <div>
            <strong>Bakgrund till 100-namn</strong>
            <br />
            {nicknameDescription}
          </div>
          <div>
            <strong>Gjort i spexet</strong>
            <br />
            {roles}
          </div>
        </div>
      </div>
      <div className="w-80">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold">Present</h2>
          <div className="flex flex-wrap">
            {(member.images || []).map((image) => (
              <GiftImage key={image.toString()} image={image} />
            ))}
          </div>
          <div>
            {description}
            <PortableText value={styledDescription} />
          </div>
        </div>
      </div>
    </article>
  );
};

export default MemberViewer;
