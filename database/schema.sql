set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "favorites" (
	"zip" integer NOT NULL,
	"city" TEXT NOT NULL,
	CONSTRAINT "favorites_pk" PRIMARY KEY ("zip")
) WITH (
  OIDS=FALSE
);
