"use client";

import groq from "groq";

import { client } from "@/sanity/client";
import { useEffect, useState } from "react";
import { Member } from "./types";
import MemberViewer from "./components/MemberViewer";

const MEMBERS_QUERY = groq`*[_type == "member"]|order(number asc)`;
const querySimilar = (name: string) =>
  groq`*[_type == "member" && name == "${name}"]|order(number asc)`;

export default function Home() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [similar, setSimilar] = useState<number[]>([]);

  useEffect(() => {
    client.fetch<Member[]>(MEMBERS_QUERY).then((data) => {
      setMembers(data);
    });
  }, []);

  useEffect(() => {
    if (selectedMember !== null) {
      client.fetch<Member[]>(querySimilar(selectedMember.name)).then((data) => {
        if (data.length > 1) {
          setSimilar(
            data
              .map(({ number }) => number)
              .filter((n) => n != selectedMember.number),
          );
        } else {
          setSimilar([]);
        }
      });
    }
  }, [selectedMember]);

  return (
    <main className="flex min-h-screen flex-col items-center gap-8 p-8 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-2xl font-bold">100-klubbens Presentregister</h1>
      {selectedMember !== null && <MemberViewer id={selectedMember.number} />}
      <ul className="grid grid-cols-5 md:grid-cols-10">
        {members.map((member) => (
          <li key={member.number} className="aspect-square list-none border">
            <button
              className="flex h-full w-full items-center justify-center p-4 text-3xl hover:underline"
              style={{
                backgroundColor: similar.includes(member.number)
                  ? "#00000022"
                  : "white",
                textDecorationLine:
                  member.number === selectedMember?.number ? "underline" : "",
              }}
              onClick={() => setSelectedMember(member)}
            >
              {member.number}
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
